from .models import Staff, Movie, Genre, Country, Rating, Review
from .serializers import (MovieSerial, MovieCUDSerial, GenreSerial,
						CountrySerial, StaffSerial, RatingSerial,
						RatingCUDSerial, ReviewSerial,	ReviewCUDSerial,
						QuerySerializer)
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser, AllowAny
from .mv_permissions import IsAdminOrReadOnly, IsNotAdmin, IsRaterOrRead, IsReviewerOrRead
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status, filters
from django.http import JsonResponse


class MovieViewList(generics.ListCreateAPIView):
	queryset = Movie.objects.all()
	serializer_class = MovieSerial
	permission_classes = [IsAdminOrReadOnly]
	filter_backends = [filters.OrderingFilter]
	ordering_fields = ['year', 'title', 'avg_rating', 'num_of_ratings']

	def query_check(self, qery_param, queryset):
		qry_serial = QuerySerializer(data=self.request.query_params)
		qry_serial.is_valid(raise_exception=True)
		return qry_serial.validated_data.get(qery_param)

	def get_queryset(self):
		queryset = self.queryset.all()
		if self.request.query_params.get('genre', None) is not None:
			queryset = queryset.filter(genres__name=self.query_check('genre', queryset))
		if self.request.query_params.get('country', None) is not None:
			queryset = queryset.filter(countries__name=self.query_check('country', queryset))
		return queryset

	def get_serializer_class(self):
		return MovieCUDSerial if self.request.method == 'POST' else MovieSerial


class MovieView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Movie.objects.all()
	serializer_class = MovieSerial
	permission_classes = [IsAdminOrReadOnly]

	def get_serializer_class(self):
		return MovieCUDSerial if self.request.method in ('PUT', 'PATCH') else MovieSerial



class GenreViewList(generics.ListCreateAPIView):
	queryset = Genre.objects.all()
	serializer_class = GenreSerial
	permission_classes = [IsAdminOrReadOnly]

class GenreDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Genre.objects.all()
	serializer_class = GenreSerial
	permission_classes = [IsAdminUser]


class CountryViewList(generics.ListCreateAPIView):
	queryset = Country.objects.all()
	serializer_class = CountrySerial
	permission_classes = [IsAdminOrReadOnly]

class CountryDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Country.objects.all()
	serializer_class = CountrySerial
	permission_classes = [IsAdminUser]



class StaffViewList(generics.ListCreateAPIView):
	queryset = Staff.objects.all()
	serializer_class = StaffSerial
	permission_classes = [IsAdminUser]

class StaffView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Staff.objects.all()
	serializer_class = StaffSerial
	permission_classes = [IsAdminOrReadOnly]



@api_view(['POST'])
@permission_classes([IsAuthenticated, IsNotAdmin])
def rate_movie(request, movie_pk):
	marks = request.data.get('mark', None)
	if marks is not None:
		movie = get_object_or_404(Movie, pk=movie_pk)
		user = request.user
		rating_obj, created = Rating.objects.update_or_create(movie=movie, user=user,
															  defaults={'mark': marks})

		serializer = RatingSerial(rating_obj, data=request.data, many=False)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data, status=status.HTTP_200_OK)

	else:
		return Response(status=status.HTTP_400_BAD_REQUEST)



class RatingViewList(generics.ListCreateAPIView):
	queryset = Rating.objects.all()
	serializer_class = RatingSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin]

	def get_serializer_class(self):
		return RatingCUDSerial if self.request.method == 'POST' else RatingSerial


class RatingView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Rating.objects.all()
	serializer_class = RatingSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin, IsRaterOrRead]

	def get_serializer_class(self):
		return RatingCUDSerial if self.request.method in ('PUT', 'PATCH') else RatingSerial



class ReviewViewList(generics.ListCreateAPIView):
	queryset = Review.objects.all()
	serializer_class = ReviewSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin, IsReviewerOrRead]

	def get_serializer_class(self):
		return ReviewCUDSerial if self.request.method == 'POST' else ReviewSerial


class ReviewView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Review.objects.all()
	serializer_class = ReviewSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin, IsReviewerOrRead]

	def get_serializer_class(self):
		return ReviewCUDSerial if self.request.method in ('PUT', 'PATCH') else ReviewSerial



@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def approve_review(request, pk):
	review = get_object_or_404(Review, pk=pk)
	review.approve()
	serializer = ReviewSerial(review, data=request.data, partial=True)
	serializer.is_valid(raise_exception=True)
	serializer.save()
	return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def remove_review(request, pk):
	review = get_object_or_404(Review, pk=pk)
	review.delete()
	return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
@permission_classes([AllowAny])
def search(request):
	data = request.data.get("search_qry", None)
	data = data.strip()
	if data is not None and data != '':
		srch_movies = Movie.objects.filter(title__icontains=data)
		reg_data = r'(' + '|'.join(data.split(' ')) + ')'
		staff = Staff.objects.all() 
		srch_staff = staff.filter(name__iregex=reg_data).union(staff.filter(surname__iregex=reg_data))
		return Response({
			"movies": MovieSerial(srch_movies, many=True).data,
			"staff": StaffSerial(srch_staff, many=True).data 
			},
			status=status.HTTP_200_OK)
	return Response({
		'empty':'Search query wasn\'t provided'
		})  


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_movie_rating(request, movie_id):
	user = request.user
	rating = Rating.objects.filter(user=user, movie__id=movie_id).first()
	
	return Response({
		'rating': 0 if rating is None else rating.mark
	},status=status.HTTP_200_OK) 