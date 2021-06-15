from django.contrib import admin
from .models import Staff, Movie, Genre, Country, Rating, Review


admin.site.register(Staff)

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'year']

admin.site.register(Genre)
admin.site.register(Country)

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['mark', 'movie', 'user']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['title', 'movie', 'author']
