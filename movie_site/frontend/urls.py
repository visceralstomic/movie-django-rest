from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('movie/<int:movie_id>', index)
]
