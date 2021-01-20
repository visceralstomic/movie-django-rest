from .models import Staff, Movie, Country, Genre, Rating, Review
from rest_framework import serializers


"""
Mini serializers block
"""

class MiniStaffSerial(serializers.ModelSerializer):
	class Meta:
		model = Staff
		fields = ['id','name', 'surname']

class MiniCountrySerial(serializers.ModelSerializer):
	class Meta:
		model = Country
		fields = ['name']

class MiniGenresSerial(serializers.ModelSerializer):
	class Meta:
		model = Genre
		fields = ['name']

class MiniMoviesSerial(serializers.ModelSerializer):
	class Meta:
		model = Movie
		fields = ['id', 'title']

class MiniReviewSerial(serializers.ModelSerializer):
	author = serializers.CharField()

	class Meta:
		model = Review
		fields = ['id', 'title', 'review_text', 'author']

class MiniRatingSerial(serializers.ModelSerializer):
	class Meta:
		model = Rating
		fields = ['movie', 'mark']

"""
Mini serializers block end
"""



class MovieSerial(serializers.ModelSerializer):
	director = MiniStaffSerial(many=True, read_only=True)
	writers = MiniStaffSerial(many=True, read_only=True)
	actors = MiniStaffSerial(many=True, read_only=True)
	countries = MiniCountrySerial(many=True, read_only=True)
	genres = MiniGenresSerial(many=True, read_only=True)
	reviews = MiniReviewSerial(many=True, read_only=True)

	class Meta:
		model = Movie
		fields = ['id','title', 'year', 'director', 'writers', 'actors',
				  'plot', 'genres', 'countries', 'num_of_ratings', 'avg_rating', 'reviews']



class MovieCUDSerial(serializers.ModelSerializer):
	class Meta:
		model = Movie
		exclude = ['id', 'num_of_ratings', 'avg_rating']



class StaffSerial(serializers.ModelSerializer):
	director = MiniMoviesSerial(many=True, read_only=True)
	writers = MiniMoviesSerial(many=True, read_only=True)
	actors = MiniMoviesSerial(many=True, read_only=True)

	class Meta:
		model = Staff
		fields = ['id', 'name', 'surname', 'director', 'writers', 'actors']



class CountrySerial(serializers.ModelSerializer):
	movies = MiniMoviesSerial(many=True, read_only=True)

	class Meta:
		model = Country
		fields = ['id', 'name', 'movies']


class GenreSerial(serializers.ModelSerializer):
	movies = MiniMoviesSerial(many=True, read_only=True)

	class Meta:
		model = Genre
		fields = ['id', 'name', 'movies']


class RatingSerial(serializers.ModelSerializer):
	movie = serializers.ReadOnlyField(source='movie.title')
	user = serializers.ReadOnlyField(source='user.username')

	class Meta:
		model = Rating
		fields = ['id', 'mark', 'user', 'movie']

class RatingCUDSerial(serializers.ModelSerializer):
	user = serializers.HiddenField(default=serializers.CurrentUserDefault())

	class Meta:
		model = Rating
		fields = ['mark', 'user', 'movie']



class ReviewSerial(serializers.ModelSerializer):
	author = serializers.CharField()
	movie = serializers.CharField()

	class Meta:
		model = Review
		fields = ['id', 'title', 'review_text', 'created', 'approved', 'author', 'movie']

class ReviewCUDSerial(serializers.ModelSerializer):
	author = serializers.HiddenField(default=serializers.CurrentUserDefault())

	class Meta:
		model = Review
		fields = ['title', 'review_text', 'author', 'movie']



class QuerySerializer(serializers.Serializer):
	genre = serializers.CharField(required=False)
	country = serializers.CharField(required=False)

	def validate_country(self, value):
		if not value.isdigit():
			return value
		raise serializers.ValidationError("Country value must be string")

	def validate_genre(self, value):
		if not value.isdigit():
			return value
		raise serializers.ValidationError("Genre value must be string")
