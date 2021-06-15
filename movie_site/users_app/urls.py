from django.urls import path
from .views import (UserList, UserDetail, get_current_user, user_stats,
                   logout_blacklist_token, get_rating_stats, RegisterUser)
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('', UserList.as_view()),
    path('<int:pk>', UserDetail.as_view()),
    path('register/', RegisterUser.as_view(), name='register'),
    path('token/obtain/',  jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('current_user/', get_current_user),
    path('blacklist/', logout_blacklist_token, name='blacklist'),
    path('rating_stats/', get_rating_stats, name='rating_stats'),
    path('user_stats/', user_stats, name='user_stats'),
]
