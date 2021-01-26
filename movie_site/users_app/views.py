from django.contrib.auth import get_user_model
from .serializers import UserSerial
from rest_framework import generics, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


User = get_user_model()



class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerial


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerial

def get_current_user(request):
    jwt_obj = JWTAuthentication()
    val_token = jwt_obj.get_validated_token(request.headers.get('access'))
    user = jwt_obj.get_user(val_token)
    return JsonResponse({"user": user.username})


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_blacklist_token(request):
    refresh_token = request.data["refresh_token"]
    token = RefreshToken(refresh_token)
    token.blacklist()
    return Response(status=status.HTTP_205_RESET_CONTENT)
