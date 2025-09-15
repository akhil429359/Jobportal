# Create your views here.
from rest_framework import viewsets, permissions
from .models import Connection, Chat, GroupChat, GroupChatMembers,GroupMessage
from .serializers import (ConnectionSerializer, ChatSerializer, GroupChatSerializer, GroupChatMembersSerializer,GroupMessageSerializer)
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import  filters
from rest_framework.decorators import action
from Accounts.models import User,Notification

from rest_framework.permissions import IsAuthenticated


class ConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Connection.objects.filter(Q(requested_id=user) | Q(receiver_id=user))

    def perform_create(self, serializer):
        receiver = serializer.validated_data.get("receiver_id")
        user = self.request.user

        if receiver == user:
            raise ValidationError("You cannot send a connection request to yourself.")

        existing = Connection.objects.filter(
            Q(requested_id=user, receiver_id=receiver) |
            Q(requested_id=receiver, receiver_id=user)
        ).first()

        if existing:
            if existing.status == "Accepted":
                raise ValidationError("You are already connected.")
            elif existing.status == "Pending":
                # Accept the incoming request if it was sent to us
                if existing.requested_id == receiver:
                    existing.status = "Accepted"
                    existing.save()
                    serializer.instance = existing  # return updated instance
                    return
                else:
                    raise ValidationError("You already sent a pending request.")

        serializer.save(requested_id=user, status="Pending")

        #  Send notification to the receiver
        Notification.objects.create(
            user=receiver,
            type="friend_request",
            message=f"{user.username} sent you a connection request",
            link=f"/connections/"  # optional: link to connections page
        )

    def perform_update(self, serializer):
        instance = serializer.instance
        user = self.request.user

        if instance.receiver_id != user:
            raise PermissionDenied("You cannot update this connection request.")

        new_status = self.request.data.get('status')
        if new_status not in ["Pending", "Accepted", "Rejected"]:
            raise PermissionDenied("Invalid status value.")

        serializer.save(status=new_status)

        # Delete reverse pending requests if accepted
        if new_status == "Accepted":
            Connection.objects.filter(
                requested_id=instance.receiver_id,
                receiver_id=instance.requested_id,
                status="Pending"
            ).delete()

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Messages where user is sender or receiver
        return Chat.objects.filter(sender_id=user) | Chat.objects.filter(receiver_id=user)

    def perform_create(self, serializer):
        sender = self.request.user
        receiver = serializer.validated_data.get("receiver_id")

        if sender == receiver:
            raise PermissionDenied("You cannot send a message to yourself.")

        # Check if users are connected
        if not Connection.objects.filter(
            Q(requested_id=sender, receiver_id=receiver, status="Accepted") |
            Q(requested_id=receiver, receiver_id=sender, status="Accepted")
        ).exists():
            raise PermissionDenied("You can only message users you are connected with.")

        serializer.save(sender_id=sender)




class GroupChatViewSet(viewsets.ModelViewSet):
    serializer_class = GroupChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['group_name']

    def get_queryset(self):
        # Return all groups (frontend uses is_member/is_admin for buttons)
        queryset = GroupChat.objects.all()
        search_term = self.request.query_params.get('search')

        if search_term:
            queryset = queryset.filter(group_name__icontains=search_term)

        return queryset

    @action(detail=True, methods=["post"])
    def join(self, request, pk=None):
        group = self.get_object()
        user = request.user

        # Check if user already a member
        if group.members.filter(user=user).exists():
            return Response({"detail": "Already a member"}, status=400)

        # Correctly create membership
        GroupChatMembers.objects.create(group_id=group, user=user)

        return Response({"detail": "Joined successfully"}, status=200)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        group = self.get_object()
        user = request.user

        # Admin cannot leave their own group
        if group.admin_id == user:
            return Response({"detail": "Admin cannot leave the group"}, status=400)

        # Use the correct query
        membership = GroupChatMembers.objects.filter(group_id=group, user=user).first()
        if not membership:
            return Response({"detail": "You are not a member of this group"}, status=400)

        membership.delete()
        return Response({"detail": "You have left the group"}, status=200)

    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        group = serializer.save(admin_id=self.request.user)
        # Add admin as a member too
        GroupChatMembers.objects.create(group_id=group, user=self.request.user)


class GroupChatMembersViewSet(viewsets.ModelViewSet):
    serializer_class = GroupChatMembersSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return GroupChatMembers.objects.filter(group_id=group_id)
        return GroupChatMembers.objects.none()


def perform_create(self, serializer):
    group = serializer.validated_data['group_id']
    user = serializer.validated_data['user']

    if group.admin_id != self.request.user:
        raise PermissionDenied("Only the group admin can add members.")

    # Check if admin has accepted connection with the user
    if not Connection.objects.filter(
        (Q(requested_id=self.request.user) & Q(receiver_id=user) & Q(status="Accepted")) |
        (Q(requested_id=user) & Q(receiver_id=self.request.user) & Q(status="Accepted"))
    ).exists():
        raise PermissionDenied("You can only add users who are connected with you.")

    serializer.save()

    # ✅ Send notification to the added user
    Notification.objects.create(
        user=user,
        type="group_invite",
        message=f"You have been added to the group '{group.group_name}'",
        link=f"/groups/{group.id}/"
    )

        
    @action(detail=False, methods=['get'], url_path='addable-users')
    def addable_users(self, request):
        group_id = request.query_params.get('group')
        if not group_id:
            return Response({"detail": "Group ID required"}, status=400)
        group = GroupChat.objects.get(id=group_id)
        if group.admin_id != request.user:
            return Response({"detail": "Only admin can see addable users"}, status=403)

        # Admin's accepted connections
        connections = Connection.objects.filter(
            status='Accepted'
        ).filter(
            Q(requested_id=request.user) | Q(receiver_id=request.user)
        )

        connected_user_ids = set()
        for c in connections:
            if c.requested_id != request.user:
                connected_user_ids.add(c.requested_id.id)
            if c.receiver_id != request.user:
                connected_user_ids.add(c.receiver_id.id)

        # Exclude existing members
        existing_members_ids = GroupChatMembers.objects.filter(group_id=group).values_list('user_id', flat=True)
        addable_ids = connected_user_ids - set(existing_members_ids)

        users = User.objects.filter(id__in=addable_ids)
        from Accounts.serializers import UserSerializer
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)



class GroupMessageViewSet(viewsets.ModelViewSet):
    serializer_class = GroupMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        group_id = self.request.query_params.get('group')

        # Include messages if user is admin or member
        queryset = GroupMessage.objects.filter(
            Q(group__members__user=user) | Q(group__admin_id=user)
        ).distinct()

        if group_id:
            queryset = queryset.filter(group_id=group_id)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        group = serializer.validated_data.get('group')

        # Check if user is a member
        if not GroupChatMembers.objects.filter(group_id=group, user=user).exists() and group.admin_id != user:
            raise PermissionDenied("You are not a member of this group.")

        serializer.save(sender=user)
