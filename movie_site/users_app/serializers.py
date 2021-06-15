from rest_framework import serializers
from django.contrib.auth import get_user_model
from movies_app.serializers import MiniRatingSerial, MiniReviewSerial
from rest_framework.validators import UniqueValidator

User = get_user_model()


class RegisterSerial(serializers.ModelSerializer):
	password2 = serializers.CharField(write_only=True, required=True)

	class Meta:
		model = User
		fields = ['username','password','password2','email']
		extra_kwargs = {'email': {'validators': [UniqueValidator(queryset=User.objects.all())]},}


	def validate(self, attrs):
		if attrs['password'] != attrs['password2']:
			raise serializers.ValidationError({
				'password': 'Passwords fields didn\'t match'
			})

		return attrs
	
	def create(self, validated_data):
		validated_data.pop('password2')
		user = User.objects.create_user(**validated_data)
		user.save()
		return user



class UserSerial(serializers.ModelSerializer):
	ratings = MiniRatingSerial(many=True, required=False, read_only=True)
	reviews = MiniReviewSerial(many=True, required=False, read_only=True)

	class Meta:
		model = User
		fields = ['id', 'username', 'first_name','last_name', 'email', 'photo', 'ratings', 'reviews' ]

	def create(self, validated_data):
		user = User.objects.create_user(username=validated_data['username'],
										password=validated_data['password'])

		user.save()
		return user


