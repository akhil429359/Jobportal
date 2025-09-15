"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from Jobs.views import ApplicationViewSet
from Accounts.views import UserViewSet,UserProfileViewSet,NotificationViewSet,ContactMessageCreateView
from Chats.views import (ConnectionViewSet,ChatViewSet,GroupChatViewSet,GroupChatMembersViewSet,GroupMessageViewSet,)
from Jobs.views import JobPostsViewSet, ApplicationViewSet
from rest_framework.authtoken.views import obtain_auth_token


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'user-profiles', UserProfileViewSet, basename='userprofile')
router.register(r'connections', ConnectionViewSet, basename='connection')
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'group-chats', GroupChatViewSet, basename='groupchat')
router.register(r'group-members', GroupChatMembersViewSet, basename='groupmembers')
router.register(r'group-messages', GroupMessageViewSet, basename='groupmessages')
router.register(r'job-posts', JobPostsViewSet, basename='jobposts')
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('Accounts.urls')), 

# DRF Token Auth endpoint
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
]

if settings.DEBUG:
    urlpatterns +=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
