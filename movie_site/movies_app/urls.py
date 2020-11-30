from django.urls import path
from .view import ( MovieViewList, MovieView, GenreViewList, GenreView,
					CountryViewList, CountryView, StaffViewList, StaffView,
					RatingViewList, RatingView, ReviewView, ReviewViewList,
					approve_review, remove_review, search)

urlpatterns = [
	path('movies/', MovieViewList.as_view()),
	path('movies/<int:pk>', MovieView.as_view()),
	path('genres/', GenreViewList.as_view()),
	path('genres/<int:pk>', GenreView.as_view()),
	path('countries/', CountryViewList.as_view()),
	path('countries/<int:pk>', CountryView.as_view()),
	path('staff/', StaffViewList.as_view()),
	path('staff/<int:pk>', StaffView.as_view()),
	path('rating/', RatingViewList.as_view()),
	path('rating/<int:pk>', RatingView.as_view()),
	path('movies/<int:movie_pk>/reviews/', ReviewViewList.as_view()),
	path('movies/reviews/<int:pk>', ReviewView.as_view()),
	path('movies/reviews/<int:pk>/approve', approve_review),
	path('movies/reviews/<int:pk>/remove', remove_review),
	path('search/', search)
]
