from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('movie/<int:movie_id>', index),
    path('staff/<int:staff_id>', index),
    path('review/<int:review_id>', index),
    path('login/', index),
    path('movieform/', index)

]
