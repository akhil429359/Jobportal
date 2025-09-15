from django.db import models

class Connection(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]
    requested_id = models.ForeignKey('Accounts.User', on_delete=models.CASCADE, related_name="sent_requests")
    receiver_id = models.ForeignKey('Accounts.User', on_delete=models.CASCADE, related_name="received_requests")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")  
    created_at = models.DateTimeField(auto_now_add=True)

class Chat(models.Model):
    sender_id = models.ForeignKey('Accounts.User', on_delete=models.CASCADE, related_name="sent_messages")
    receiver_id = models.ForeignKey('Accounts.User', on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class GroupChat(models.Model):
    admin_id = models.ForeignKey('Accounts.User', on_delete=models.CASCADE, related_name="created_groups")
    group_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="group_images/", blank=True, null=True)

class GroupChatMembers(models.Model):
    group_id = models.ForeignKey("GroupChat", on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey('Accounts.User', on_delete=models.CASCADE, related_name="group_memberships")

class GroupMessage(models.Model):
    group = models.ForeignKey('GroupChat', on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('Accounts.User', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} -> {self.group.group_name}: {self.message[:20]}"
