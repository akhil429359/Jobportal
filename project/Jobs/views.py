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

        serializer.save(user=self.request.user)

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
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Application.objects.none()

        queryset = Application.objects.all()

        # ✅ Apply role-based filtering first (security!)
        if profile.role == "employer":
            queryset = queryset.filter(job_id__user=user)
        else:
            queryset = queryset.filter(applicant_id=user)

        # ✅ Then apply job filter (only within employer's own jobs)
        job_id = self.request.query_params.get("job")
        if job_id:
            queryset = queryset.filter(job_id=job_id)

        return queryset

    def perform_create(self, serializer):
        application = serializer.save(applicant_id=self.request.user)
        
        # Notify the employer
        job = application.job_id
        employer = job.user  
        Notification.objects.create(
            user=employer,
            message=f"{self.request.user.username} applied for {job.title}",
            link=f"/applications/{application.id}/"
        )

    def perform_update(self, serializer):
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise PermissionDenied("You must have a profile to update applications.")

        if profile.role != "employer":
            raise PermissionDenied("Only employers can update application status.")

        old_instance = self.get_object()
        serializer.save()
        updated_instance = self.get_object()

        # Send notification if status changed
        if old_instance.status != updated_instance.status:
            Notification.objects.create(
                user=updated_instance.applicant_id,
                message=f"Your application for '{updated_instance.job_id.title}' is now {updated_instance.status}",
                link=f"/job-list"
            )
