# Create your views here.
from rest_framework import generics
from rest_framework import viewsets,status,filters
from .models import User,UserProfile,Notification,ContactMessage
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer,UserProfileSerializer,NotificationSerializer,ContactMessageSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.conf import settings

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def perform_create(self, serializer):
        contact = serializer.save()  

        subject = f"New Contact Message: {contact.subject}"
        message = (
            f"You have a new message from {contact.name} ({contact.email}):\n\n"
            f"{contact.message}\n\n"
            "Reply to this email to contact the sender."
        )
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else None,
            ['akhilpioussince2001@example.com'], 
            fail_silently=False,
        )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name', 'email']

    def get_permissions(self):
        if self.action == 'create':  
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:  
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def all_users(self, request):
        """Return all users except current user, with optional search"""
        search = request.query_params.get("search", "").strip()

        users = User.objects.exclude(id=request.user.id)

        if search:
            users = users.filter(
                Q(username__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
            )

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def public_profile(self, request, pk=None):
        """Return public profile of any user by ID"""
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['patch'])
    def edit_details(self, request, pk=None):
        
        try:
            user = self.get_object()
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return UserProfile.objects.all()  
        return UserProfile.objects.filter(user=user)  

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_staff and 'user' in self.request.data:
            serializer.save(user=User.objects.get(id=self.request.data['user']))
        else:
            serializer.save(user=user)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='mark-read')
    def mark_read(self, request):
        notif_id = request.data.get("id")
        try:
            notif = Notification.objects.get(id=notif_id, user=request.user)
            notif.is_read = True
            notif.save()
            return Response({"status": "success"})
        except Notification.DoesNotExist:
            return Response({"status": "not found"}, status=status.HTTP_404_NOT_FOUND)
