from django.urls import path
from .views import UserList, UserDetail
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('', UserList.as_view()),
    path('<int:pk>', UserDetail.as_view()),
    path('token/obtain/',  jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh')
]
