from django.urls import path
from .views import index
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('', index),
    path('movie/<int:movie_id>', index),
    path('staff/<int:staff_id>', index),
    path('review/<int:review_id>', index),
    path('login/', index),
    path('signup/', index),
    path('movieform/', index),
    path('addinfo/', index),
    path('user/<int:uid>', index)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
