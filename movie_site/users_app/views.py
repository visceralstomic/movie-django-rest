from django.contrib.auth import get_user_model
from .serializers import UserSerial, RegisterSerial
from rest_framework import generics, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Avg, Count
from django.db.models.functions import ExtractYear
from movies_app.models import Rating
from rest_framework.parsers import FormParser, MultiPartParser


User = get_user_model()


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerial
       

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerial


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerial
    parser_classes = [MultiPartParser, FormParser]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rating_stats(request):
    ratings = Rating.objects.filter(user=request.user)
    rating_aggr = ratings.annotate(year=ExtractYear("movie__year"))              
    most_rtd_yr = list(rating_aggr.values("year").annotate(Count('year'))\
                        .values("year", "year__count").order_by("year"))
    hgst_rtd_yr = list(rating_aggr.values('year').annotate(Avg('mark'))\
                        .values("year", "mark__avg").order_by("year"))
    num_of_rating = list(ratings.values('mark').annotate(Count('mark')).order_by("mark"))
    avg_per_gnr = list(ratings.values("movie__genres__name").annotate(avg_mark=Avg("mark")))
    return JsonResponse({
        "mostRtdYr": most_rtd_yr,
        "hgstRtdYr": hgst_rtd_yr,
        "numOfRating": num_of_rating,
        "avgPerGnr": avg_per_gnr
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_stats(request):
    ratings = Rating.objects.filter(user=request.user)
    avg_rating = ratings.aggregate(avg_rate=Avg('mark'))['avg_rate']
    num_of_watched = ratings.count()

    return JsonResponse({
        "avg_rating": avg_rating,
        "num_of_watched": num_of_watched
    })



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    jwt_obj = JWTAuthentication()
    val_token = jwt_obj.get_validated_token(request.META.get('HTTP_AUTHORIZATION').replace('JWT ', ''))
    user = jwt_obj.get_user(val_token)
    return JsonResponse({"uid": user.id, "username": user.username, "is_staff": user.is_staff})


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_blacklist_token(request):
    refresh_token = request.data["refresh_token"]
    token = RefreshToken(refresh_token)
    token.blacklist()
    return Response(status=status.HTTP_205_RESET_CONTENT)

