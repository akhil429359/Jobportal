from rest_framework import serializers
from .models import JobPosts, Application
from Accounts.models import UserProfile

class JobPostsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = JobPosts
        fields = '__all__'
        read_only_fields = ['user'] 
   
    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username
        }

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["skills", "education", "experience", "resume", "about_me", "role"]

class ApplicationSerializer(serializers.ModelSerializer):
    applicant_profile = serializers.SerializerMethodField()
    applicant_user = serializers.SerializerMethodField()  # <-- NEW
    job_details = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ["id", "job_id", "job_details", "status", "applied_date", "applicant_profile", "applicant_user"]
        read_only_fields = ["applied_date"]

    def get_applicant_profile(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.applicant_id)
            return UserProfileSerializer(profile).data
        except UserProfile.DoesNotExist:
            return None

    def get_applicant_user(self, obj):
        # Return basic info from User model
        user = obj.applicant_id
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }

    def get_job_details(self, obj):
        return {
            "title": obj.job_id.title,
            "location": obj.job_id.location,
            "salary_range": obj.job_id.salary_range,
            "status": obj.job_id.status,
        }
