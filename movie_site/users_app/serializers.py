from rest_framework import serializers
from django.contrib.auth import get_user_model
from movies_app.serializers import MiniRatingSerial, MiniReviewSerial

User = get_user_model()



class UserSerial(serializers.ModelSerializer):
	rating = MiniRatingSerial(many=True)
	review = MiniReviewSerial(many=True)

	class Meta:
		model = User
		fields = ['id', 'username', 'password', 'rating', 'review' ]
		extra_kwargs = {'password': {'write_only': True, 'required': True},
                        'rating': {'read_only': True}}
