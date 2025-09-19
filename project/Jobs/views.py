from rest_framework import viewsets,permissions
from .models import JobPosts, Application
from .serializers import JobPostsSerializer, ApplicationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from Accounts.models import UserProfile
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from Accounts.models import Notification

class JobPostsViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.objects.all()
    serializer_class = JobPostsSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'location']  
    search_fields = ['title', 'description', 'requirements']

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        my_jobs = self.request.query_params.get("my_jobs")
        print("Current user:", user)  # <--- debug
        print("my_jobs param:", my_jobs)
        if my_jobs == "true":
            queryset = queryset.filter(user=user)
        return queryset


    def perform_create(self, serializer):
        try:
            profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            raise PermissionDenied("You must complete your profile before posting jobs.")

        if profile.role != 'employer':
            raise PermissionDenied("Only employers can post jobs.")

        # ✅ Ensure questions is always a list (not null)
        validated_data = serializer.validated_data
        if "questions" not in validated_data or validated_data["questions"] is None:
            validated_data["questions"] = []

        serializer.save(user=self.request.user, **validated_data)


    def perform_update(self, serializer):
        job = self.get_object()
        if job.user != self.request.user:
            raise PermissionDenied("You can only update your own job posts.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own job posts.")
        instance.delete()


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for job applications.
    Role-based filtering:
      - Employers can see applications for their own jobs only.
      - Job seekers can see only their own applications.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return applications filtered by user role and optional job_id."""
        user = self.request.user

        # ✅ Ensure user has a profile, otherwise return no results
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Application.objects.none()

        queryset = Application.objects.all()

        # ✅ Role-based filtering
        if profile.role == "employer":
            queryset = queryset.filter(job_id__user=user)
        else:  # job seeker
            queryset = queryset.filter(applicant_id=user)

        # ✅ Optional filtering by job_id (for employer dashboards)
        job_id = self.request.query_params.get("job")
        if job_id:
            queryset = queryset.filter(job_id=job_id)

        return queryset

    def perform_create(self, serializer):
        """
        Create a new application and notify the employer.
        The applicant_id is always set to the logged-in user.
        """
        application = serializer.save(applicant_id=self.request.user)

        job = application.job_id
        employer = job.user

        # ✅ Notify employer
        Notification.objects.create(
            user=employer,
            message=f"{self.request.user.username} applied for {job.title}",
            link=f"/applications/{application.id}/"
        )

    def perform_update(self, serializer):
        """
        Allow only employers to update application status.
        Notify job seeker if status changes.
        """
        user = self.request.user

        # ✅ Ensure user has profile and is employer
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise PermissionDenied("You must have a profile to update applications.")

        if profile.role != "employer":
            raise PermissionDenied("Only employers can update application status.")

        old_instance = self.get_object()
        serializer.save()
        updated_instance = self.get_object()

        # ✅ Notify job seeker if status changed
        if old_instance.status != updated_instance.status:
            Notification.objects.create(
                user=updated_instance.applicant_id,
                message=f"Your application for '{updated_instance.job_id.title}' is now {updated_instance.status}",
                link="/job-list"
            )
