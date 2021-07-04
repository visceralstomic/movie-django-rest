from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.files.images import get_image_dimensions


def validate_photo(photo):
    wdth, hgth = get_image_dimensions(photo)
    if wdth > 290 or hgth > 370:
        raise ValidationError("Size limitation is 290 x 370 ")


class User(AbstractUser):
    photo = models.ImageField(blank=True, null=True, upload_to='user_photo', validators=[validate_photo])
