from django.contrib.auth import get_user_model
from .serializers import UserSerial
from rest_framework import generics, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response



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
    print(user)
    return JsonResponse({"user": user.username})


api_view(["POST"])
def logout_blacklist_token(request):
    try:
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
