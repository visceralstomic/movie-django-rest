from .models import Staff, Movie, Genre, Country, Rating, Review
from .serializers import (MovieSerial, MovieCUDSerial, GenreSerial,
						CountrySerial, StaffSerial, RatingSerial,
						RatingCUDSerial, ReviewSerial,	ReviewCUDSerial,
						QuerySerializer)
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from .mv_permissions import IsAdminOrReadOnly, IsNotAdmin
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status, filters



class MovieViewList(generics.ListCreateAPIView):
	queryset = Movie.objects.all()
	serializer_class = MovieSerial
	permission_classes = [IsAdminOrReadOnly]
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['name']
	ordering_fields = ['year', 'title', 'avg_rating', 'num_of_ratings']

	@staticmethod
	def query_check(qery_param):
		qry_serial = QuerySerializer(data=self.request.query_params)
		qry_serial.is_valid(raise_exception=True)
		return queryset.filter(genres__name=qry_serial.validated_data.get(qery_param))

	def get_queryset(self):
		queryset = self.queryset.all()
		if self.request.query_params.get('genre', None) is not None:
			queryset = query_check('genre')
		if self.request.query_params.get('country', None) is not None:
			queryset = query_check('country')
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

	def get(self, request, *args, **kwargs):
		print('Data ', self.request.data)
		return self.list(request, *args, **kwargs)


class GenreView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Genre.objects.all()
	serializer_class = GenreSerial
	permission_classes = [IsAdminOrReadOnly]



class CountryViewList(generics.ListCreateAPIView):
	queryset = Country.objects.all()
	serializer_class = CountrySerial
	permission_classes = [IsAdminOrReadOnly]

class CountryView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Movie.objects.all()
	serializer_class = CountrySerial
	permission_classes = [IsAdminOrReadOnly]



class StaffViewList(generics.ListCreateAPIView):
	queryset = Staff.objects.all()
	serializer_class = StaffSerial
	permission_classes = [IsAdminOrReadOnly]

class StaffView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Staff.objects.all()
	serializer_class = StaffSerial
	permission_classes = [IsAdminOrReadOnly]



class RatingViewList(generics.ListCreateAPIView):
	queryset = Rating.objects.all()
	serializer_class = RatingSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin]

	def get_serializer_class(self):
		return RatingCUDSerial if self.request.method == 'POST' else RatingSerial


class RatingView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Rating.objects.all()
	serializer_class = RatingSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin]

	def get_serializer_class(self):
		return RatingCUDSerial if self.request.method in ('PUT', 'PATCH') else RatingSerial



class ReviewViewList(generics.ListCreateAPIView):
	queryset = Review.objects.all()
	serializer_class = ReviewSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin]
	lookup_field = 'movie_pk'

	def get_queryset(self):
		queryset = self.queryset.filter(movie=self.kwargs.get('movie_pk'))
		return queryset

	def get_serializer_class(self):
		return ReviewCUDSerial if self.request.method == 'POST' else ReviewSerial


class ReviewView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Review.objects.all()
	serializer_class = ReviewSerial
	permission_classes = [IsAuthenticatedOrReadOnly, IsNotAdmin]

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



@api_view(['GET'])
def search(request):
	qry = request.query_params.get('q', None)
	if qry is not None and qry != '':
		movies = Movie.objects.all()
		staff = Staff.objects.all()
		qry = qry.strip()
		movies = movies.filter(title__icontains=qry)
		reg_qry = r'('+'|'.join(qry.split(' ')) + ')'
		staff = staff.filter(surname__iregex=reg_qry).union(staff.filter(surname__iregex=reg_qry))
		return Response({
			'movies': MovieSerial(movies, many=True).data,
			'staff': StaffSerial(staff, many=True).data
				},
			status=status.HTTP_200_OK)
	return Response({
		'search':'Results not found or search query wasn\'t provided'
	})
		#
