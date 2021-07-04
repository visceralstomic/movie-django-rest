from django.urls import path
from .view import ( MovieViewList, MovieView, GenreViewList, GenreDetail,
					CountryViewList, CountryDetail, StaffViewList, StaffView,
					RatingViewList, RatingView, rate_movie,
					ReviewView, ReviewViewList, get_user_movie_rating,
					approve_review, remove_review, search)

app_name = 'movies_app'
urlpatterns = [
	path('movies/', MovieViewList.as_view(), name='movies'),
	path('movies/<int:pk>', MovieView.as_view(), name='movie-detail'),
	path('movies/<int:movie_pk>/rate/', rate_movie, name='rate-movie'),
	path('movies/reviews/', ReviewViewList.as_view(), name='reviews'),
	path('movies/reviews/<int:pk>', ReviewView.as_view(), name='review-detail'),
	path('rating/', RatingViewList.as_view(), name='rating'),
	path('rating/<int:pk>', RatingView.as_view(), name='rating-detail'),
	path('staff/<int:pk>', StaffView.as_view(), name='staff-detail'),
	path('search/', search, name='search'),
	path('user_movie_rating/<int:movie_id>', get_user_movie_rating, name='user-movie-rating'),
	
	path('admin/genres/', GenreViewList.as_view(), name='admin-genre'),
	path('admin/genres/<int:pk>', GenreDetail.as_view(), name='admin-genre-detail'),
	path('admin/countries/', CountryViewList.as_view(), name='admin-countries'),
	path('admin/countries/<int:pk>', CountryDetail.as_view(), name='admin-coutry-detail'),
	path('admin/staff/', StaffViewList.as_view(), name='admin-staff'),
	path('admin/reviews/<int:pk>/approve', approve_review, name='admin-review-approve'),
	path('admin/reviews/<int:pk>/remove', remove_review, name='admin-review-remove')
]
