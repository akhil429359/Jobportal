from django.db import models
# Create your models here.

class JobPosts(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('paused', 'Paused'),
    ]

    user = models.ForeignKey("Accounts.User", on_delete=models.CASCADE)  
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    salary_range = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')  
    requirements = models.TextField()

class Application(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Shortlisted", "Shortlisted"),
        ("Rejected", "Rejected"),
        ("Hired", "Hired"),
    ]

    job_id = models.ForeignKey(JobPosts, on_delete=models.CASCADE, related_name="applications")
    applicant_id = models.ForeignKey("Accounts.User", on_delete=models.CASCADE, related_name="applications")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    applied_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant.username} → {self.job.title} ({self.status})"
