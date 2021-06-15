from django.urls import path
from .view import ( MovieViewList, MovieView, GenreViewList, GenreDetail,
					CountryViewList, CountryDetail, StaffViewList, StaffView,
					RatingViewList, RatingView, rate_movie,
					ReviewView, ReviewViewList, get_user_movie_rating,
					approve_review, remove_review, search)

urlpatterns = [
	path('movies/', MovieViewList.as_view()),
	path('movies/<int:pk>', MovieView.as_view()),
	path('movies/<int:movie_pk>/rate/', rate_movie),
	path('movies/reviews/', ReviewViewList.as_view()),
	path('movies/reviews/<int:pk>', ReviewView.as_view()),
	path('rating/', RatingViewList.as_view()),
	path('rating/<int:pk>', RatingView.as_view()),
	path('staff/<int:pk>', StaffView.as_view()),
	path('search/', search),
	path('user_movie_rating/<int:movie_id>', get_user_movie_rating),
	
	path('admin/genres/', GenreViewList.as_view()),
	path('admin/genres/<int:pk>', GenreDetail.as_view()),
	path('admin/countries/', CountryViewList.as_view()),
	path('admin/countries/<int:pk>', CountryDetail.as_view()),
	path('admin/staff/', StaffViewList.as_view()),
	path('admin/reviews/<int:pk>/approve', approve_review),
	path('admin/reviews/<int:pk>/remove', remove_review)
]
