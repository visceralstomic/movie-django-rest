from django.contrib import admin
from .models import Staff, Movie, Genre, Country, Rating, Review

admin.site.register(Staff)
admin.site.register(Movie)
admin.site.register(Genre)
admin.site.register(Country)
admin.site.register(Rating)
admin.site.register(Review)
