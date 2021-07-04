from django.urls import path
from .views import (UserList, UserDetail, get_current_user, user_stats,
                   logout_blacklist_token, get_rating_stats, RegisterUser)
from rest_framework_simplejwt import views as jwt_views

app_name = 'users_app'
urlpatterns = [
    path('', UserList.as_view(), name='users'),
    path('<int:pk>', UserDetail.as_view(), name='user-detail'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('token/obtain/',  jwt_views.TokenObtainPairView.as_view(), name='token-create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token-refresh'),
    path('current_user/', get_current_user, name='current-user'),
    path('blacklist/', logout_blacklist_token, name='blacklist'),
    path('rating_stats/', get_rating_stats, name='rating-stats'),
    path('user_stats/', user_stats, name='user-stats'),
]
