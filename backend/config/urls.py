from django.contrib import admin
from django.urls import path, include
from accounts import views as account_views
from learning import views as learning_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('learning.urls')),
    
    # User endpoints
    path('api/users/profile/', account_views.profile_view, name='user_profile'),
    path('api/users/progress/', learning_views.get_progress_view, name='user_progress'),
    path('api/users/badges/', learning_views.get_badges_view, name='user_badges'),
]
