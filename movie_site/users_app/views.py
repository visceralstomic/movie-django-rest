from django.contrib.auth import get_user_model
from .serializers import UserSerial
from rest_framework import generics

User = get_user_model()



class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerial


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerial
