from rest_framework import serializers
from .models import Connection, Chat, GroupChat, GroupChatMembers,GroupMessage
from Accounts.serializers import UserSerializer

class ConnectionSerializer(serializers.ModelSerializer):
    requested_id = UserSerializer(read_only=True)
    receiver_id_detail = UserSerializer(source='receiver_id', read_only=True)
    class Meta:
        model = Connection
        fields = '__all__'
        read_only_fields = ["requested_id"]

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'
        read_only_fields = ["sender_id", "timestamp"]

class GroupChatSerializer(serializers.ModelSerializer):
    admin_username = serializers.ReadOnlyField(source='admin_id.username')
    is_member = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = GroupChat
        fields = ['id', 'group_name', 'admin_id', 'admin_username',"description", "image", 'is_member', 'is_admin']
        read_only_fields = ['admin_id', 'admin_username', 'is_member', 'is_admin']

    def get_is_member(self, obj):
        user = self.context['request'].user
        return obj.members.filter(user=user).exists() or obj.admin_id == user

    def get_is_admin(self, obj):
        user = self.context['request'].user
        return obj.admin_id == user

class GroupChatMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupChatMembers
        fields = '__all__'

    def validate(self, attrs):
        request = self.context['request']
        current_user = request.user
        user_to_add = attrs['user']

        # Check if the user to add is a friend
        is_friend = Connection.objects.filter(
            status='Accepted',
            requested_id__in=[current_user, user_to_add],
            receiver_id__in=[current_user, user_to_add]
        ).exists()

        if not is_friend:
            raise serializers.ValidationError({
                'user': 'You can only add friends to the group.'
            })

        return attrs

class GroupMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = GroupMessage
        fields = ['id', 'group', 'sender', 'sender_username', 'message', 'timestamp']
        read_only_fields = ['sender', 'timestamp', 'sender_username']
