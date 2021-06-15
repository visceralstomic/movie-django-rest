from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from django.db.models import Avg
from datetime import date

User = get_user_model()


class Staff(models.Model):
	name = models.CharField(max_length=50)
	surname = models.CharField(max_length=50)

	class Meta:
		verbose_name_plural = 'Staff'

	def __str__(self):
		return f"{self.name} {self.surname}"


class Genre(models.Model):
	name = models.CharField(max_length=20)

	def __str__(self):
		return self.name


class Country(models.Model):
	name = models.CharField(max_length=20)

	class Meta:
		verbose_name_plural = 'Countries'

	def __str__(self):
		return self.name


class Movie(models.Model):
	title = models.CharField(max_length=200)
	year = models.DateField()
	director = models.ManyToManyField(Staff, related_name="director")
	writers = models.ManyToManyField(Staff, related_name="writers")
	actors = models.ManyToManyField(Staff, related_name="actors")
	plot = models.TextField(max_length=2000)
	genres = models.ManyToManyField(Genre, related_name='movies')
	countries = models.ManyToManyField(Country, related_name='movies')
	num_of_ratings = models.IntegerField(null=True, blank=True, default=0)
	avg_rating = models.FloatField(default=0, blank=True)

	def get_reviews(self):
		return self.reviews.filter(approved=True)

	def update_rating(self):
		rating = Rating.objects.filter(movie=self)
		self.num_of_ratings = rating.count()
		self.avg_rating = rating.aggregate(Avg('mark'))['mark__avg']
		self.save()

	def __str__(self):
		return self.title


class Rating(models.Model):
	mark = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
	movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
	rate_date = models.DateField(default=date.today)

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)
		self.movie.update_rating()

	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		self.movie.update_rating()

	def __str__(self):
		return f'{self.mark:.3f}'

	class Meta:
		unique_together = [['user', 'movie'],]
		index_together = [['user', 'movie'],]


class Review(models.Model):
	title = models.CharField(max_length=100)
	review_text = models.TextField(max_length=5000, blank=True)
	created = models.DateTimeField(auto_now_add=True)
	approved = models.BooleanField(default=False)
	movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
	author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')

	def approve(self):
		self.approved = True
		self.save()

	def __str__(self):
		return self.title

	class Meta:
		unique_together = [['author', 'movie'],]
