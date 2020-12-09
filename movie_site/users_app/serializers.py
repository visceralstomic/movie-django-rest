from rest_framework import serializers
from django.contrib.auth import get_user_model
from movies_app.serializers import MiniRatingSerial, MiniReviewSerial

User = get_user_model()



class UserSerial(serializers.ModelSerializer):
	ratings = MiniRatingSerial(many=True, required=False, read_only=True)
	reviews = MiniReviewSerial(many=True, required=False, read_only=True)

	class Meta:
		model = User
		fields = ['id', 'username', 'password', 'ratings', 'reviews' ]
		extra_kwargs = {'password': {'write_only': True, 'required': True},}

	def create(self, validated_data):
		user = User.objects.create_user(username=validated_data['username'],
										password=validated_data['password'])

		user.save()
		return user
