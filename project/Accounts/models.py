from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.



class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class User(AbstractUser):
    

    ROLE_CHOICES = [
        ('jobseeker', 'Job Seeker'),
        ('employer', 'Employer'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='jobseeker')

    class Meta:
        db_table = "accounts_user"  


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('jobseeker', 'Job Seeker'),
        ('employer', 'Employer'),
    ]

    user = models.OneToOneField("User", on_delete=models.CASCADE)
    skills = models.TextField()
    education = models.TextField()
    experience = models.TextField()
    resume = models.FileField(upload_to="resumes/", null=True, blank=True)
    about_me = models.TextField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='jobseeker')

    def __str__(self):
        return f"{self.user.username} - {self.role}"



class Notification(models.Model):
    NOTIF_TYPE_CHOICES = [
        ('friend_request', 'Friend Request'),
        ('group_invite', 'Group Invite'),
        ('message', 'Message'),
        ('job_update', 'Job Update'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=NOTIF_TYPE_CHOICES)
    message = models.TextField()
    link = models.CharField(max_length=255, blank=True) 
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
