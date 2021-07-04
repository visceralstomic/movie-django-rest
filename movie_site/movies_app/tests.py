
import datetime
from .models import Staff, Movie, Rating, Genre, Country, Review
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from django.db import IntegrityError
import json
from PIL import Image
import io

User = get_user_model()


class TestSetUp(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin', password="12345y",
            is_staff=True, is_superuser=True    
        )
        self.test_user1 = User.objects.create_user(
            username='test_user1', password='12345y', email='test_mail@email.com'
        )
        self.test_user2 = User.objects.create_user(
            username='test_user2', password='12345y'
        )


        self.staff1 = Staff.objects.create(name='staff_name1', surname='staff_sur1')
        self.staff2 = Staff.objects.create(name='staff_name2', surname='staff_sur2')
        self.staff3 = Staff.objects.create(name='staff_name3', surname='staff_sur3')
        self.staff4 = Staff.objects.create(name='staff_name4', surname='staff_sur4')

        self.country1 = Country.objects.create(name='country1')
        self.country2 = Country.objects.create(name='country2')
        self.country3 = Country.objects.create(name='country3')

        self.genre1 = Genre.objects.create(name='genre1')
        self.genre2 = Genre.objects.create(name='genre2')
        self.genre3 = Genre.objects.create(name='genre3')


        self.movie1 = Movie.objects.create(
            title='movie1',
            year=datetime.date(1941,10,5),
            plot='asgtehweqhfhg',
        )
        self.movie1.director.add(self.staff1)
        self.movie1.actors.add(self.staff1, self.staff2)
        self.movie1.writers.add(self.staff1)
        self.movie1.countries.add(self.country1)
        self.movie1.genres.add(self.genre1, self.genre2)

        self.movie2 = Movie.objects.create(
            title='movie2',
            year=datetime.date(2010,5,11),
            plot='asg te hweqhfhg',
        )
        self.movie2.director.add(self.staff3)
        self.movie2.actors.add(self.staff3, self.staff2)
        self.movie2.writers.add(self.staff4)
        self.movie2.countries.add(self.country2)
        self.movie2.genres.add(self.genre3, self.genre2)

        self.review1 = Review.objects.create(
            title='review1',
            review_text='gfhgisgspdfhgdsg',
            movie=self.movie1,
            author=self.test_user1
        )

        self.review2 = Review.objects.create(
            title='review2',
            review_text='gfhgis gspdfhgdsg',
            movie=self.movie2,
            author=self.test_user2
        )

        self.rating1 = Rating.objects.create(
            mark=9,
            movie=self.movie1,
            user=self.test_user1
        )

    def user1_auth(self):
        url = reverse('users_app:token-create')
        data = {
            'username': 'test_user1',
            'password': '12345y'
        }
        res = self.client.post(url, data)
        self.token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.token}')
        return self.test_user1

    def user2_auth(self):
        url = reverse('users_app:token-create')
        data = {
            'username': 'test_user2',
            'password': '12345y'
        }
        res = self.client.post(url, data)
        self.token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.token}')
        return self.test_user2

    def admin_auth(self):
        url = reverse('users_app:token-create')
        data = {
            'username': 'admin',
            'password': '12345y'
        }
        res = self.client.post(url, data)
        self.token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.token}')
        return self.admin

    def create_photo(self, size):
        image_file = io.BytesIO()
        image = Image.new('RGBA', size=size, color=(100, 0, 10))
        image.save(image_file, 'png')
        image_file.name = 'test.png'
        image_file.seek(0)
        return image_file
    


class GenreTest(TestSetUp):

    def test_user_create_genre(self):
        url = reverse('movies_app:admin-genre')
        self.user1_auth()
        res = self.client.post(url,{'name': 'genre7'})
        msg = "User doesn't have rights to create genre"
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN, msg)
    
    def test_user_update_genre(self):
        pk = self.genre1.pk
        url = reverse('movies_app:admin-genre-detail', kwargs={'pk': pk})
        self.user1_auth()
        new_name = 'genre_1'
        res = self.client.patch(url,{'name': new_name})
        genre = Genre.objects.get(id=self.genre1.pk)
        msg = "User doesn't have rights to update genre"
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN, msg)
        self.assertNotEqual(new_name, genre.name)

    def test_admin_create_genre(self):
        url = reverse('movies_app:admin-genre')
        self.admin_auth()
        res = self.client.post(url,{'name': 'genre7'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
    
    def test_admin_update_genre(self):
        url = reverse('movies_app:admin-genre-detail', kwargs={'pk': self.genre1.pk})
        self.admin_auth()
        new_name = 'genre_1'
        res = self.client.patch(url,{'name': new_name})
        genre = Genre.objects.get(id=self.genre1.pk)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(new_name, genre.name, 'Must be updated')


class CountryTest(TestSetUp):
    def test_user_create_country(self):
        url = reverse('movies_app:admin-countries')
        self.user1_auth()
        res = self.client.post(url, {'name': 'Neverland'})
        msg = "User doesn't have rights to create country"
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN, msg)
    
    def test_user_update_coutry(self):
        url = reverse('movies_app:admin-coutry-detail', kwargs={'pk': self.country1.id})
        self.user2_auth()
        new_name = 'Neverland'
        res = self.client.patch(url, {'name': new_name})
        country = Country.objects.get(id=self.country1.id)
        msg = "User doesn't have rights to update country"
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN, msg)
        self.assertNotEqual(new_name, country.name)

    def test_admin_create_country(self):
        url = reverse('movies_app:admin-countries')
        self.admin_auth()
        res = self.client.post(url, {'name': 'Neverland'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_admin_update_country(self):
        url = reverse('movies_app:admin-coutry-detail', kwargs={'pk': self.country1.id})
        self.admin_auth()
        new_name = 'Country11'
        res = self.client.patch(url, {'name': new_name})
        country = Country.objects.get(id=self.country1.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(new_name, country.name, 'Must be updated')


class MovieTest(TestSetUp):

    def test_unauth_user_get_movies_list(self):
        url = reverse('movies_app:movies')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
    
    def test_auth_user_get_movies_list(self):
        url = reverse('movies_app:movies')
        self.user1_auth()
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_unauth_user_get_movie(self):
        url = reverse('movies_app:movie-detail', kwargs={'pk': self.movie1.id})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_auth_user_get_movie(self):
        url = reverse('movies_app:movie-detail', kwargs={'pk': self.movie1.id})
        self.user1_auth()
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
    
    def test_user_create_movie(self):
        url = reverse('movies_app:movies')
        self.user1_auth()
        data  = {
            'title':'movie84',
            'year':datetime.date(2009,5,11),
            'plot':'a sgte hweq hfhg',
            'genres': self.genre1.id,
            'countries': self.country3.id,
            'writers': self.staff4.id,
            'director': self.staff4.id,
            'actors': self.staff4.id,
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_amin_create_movie(self):
        url = reverse('movies_app:movies')
        self.admin_auth()
        num_of_movies = Movie.objects.count()
        data  = {
            'title':'movie84',
            'year':datetime.date(2009,5,11),
            'plot':'a sgte hweq hfhg',
            'genres': self.genre1.id,
            'countries': self.country3.id,
            'writers': self.staff4.id,
            'director': self.staff4.id,
            'actors': self.staff4.id,
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(num_of_movies + 1, Movie.objects.count() )
    
    def test_user_update_movie(self):
        url = reverse('movies_app:movie-detail', kwargs={'pk': self.movie1.id})
        self.user1_auth()
        res = self.client.patch(url, {'title': 'movie1111'})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_update_movie(self):
        url = reverse('movies_app:movie-detail', kwargs={'pk': self.movie1.id})
        self.admin_auth()
        new_title = 'movie1111'
        res = self.client.patch(url, {'title': new_title})
        movie = Movie.objects.get(id=self.movie1.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(movie.title, new_title)
    
    def test_user_delete_movie(self):
        url = reverse('movies_app:movie-detail', kwargs={'pk': self.movie1.id})
        self.user1_auth()
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_delete_movie(self):
        url = reverse('movies_app:movie-detail', kwargs={'pk': self.movie1.id})
        self.admin_auth()
        num_of_movies = Movie.objects.count()
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(num_of_movies - 1, Movie.objects.count())
    

class RatingTest(TestSetUp):
    
    def test_unauth_user_rate_movie(self):
        url = reverse('movies_app:rate-movie', kwargs={'movie_pk': self.movie2.id})
        res = self.client.post(url, {'mark': 5})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_auth_user_rate_movie(self):
        url = reverse('movies_app:rate-movie', kwargs={'movie_pk': self.movie1.id})
        num_of_rate = self.movie1.num_of_ratings
        self.user2_auth()
        res = self.client.post(url, {'mark': 7})
        rating = Rating.objects.get(id=res.data['id'])
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(num_of_rate + 1, Movie.objects.get(id=self.movie1.id).num_of_ratings)
        self.assertEqual(rating.user, self.test_user2)
    
    def test_user_update_others_rating(self):
        url = reverse('movies_app:rating-detail', kwargs={'pk': self.rating1.id})
        self.user2_auth()
        old_rating = self.rating1.mark
        res = self.client.patch(url, {'mark':1})
        new_rating = Rating.objects.get(id=self.rating1.id)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(old_rating, new_rating.mark)

    def test_user_update_his_rating(self):
        url = reverse('movies_app:rating-detail', kwargs={'pk': self.rating1.id})
        self.user1_auth()
        old_rating = self.rating1.mark
        res = self.client.patch(url, {'mark':10})
        new_rating = Rating.objects.get(id=self.rating1.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotEqual(old_rating, new_rating.mark)
    
    def test_admin_cant_rate_movie(self):
        url = reverse('movies_app:rate-movie', kwargs={'movie_pk': self.movie1.id})
        self.admin_auth()
        res = self.client.post(url, {'mark': 7})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_more_than_one_rating(self):
        url = reverse('movies_app:rating')
        self.user1_auth()
        res = self.client.post(url, {'mark':7, 'movie': self.movie1.id})
        msg="User can't make more than one rating on one movie"
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST,msg=msg)

    def test_db_more_one_rating(self):
        msg="User can't make more than one rating on one movie"
        with self.assertRaises(IntegrityError, msg=msg):
            Rating.objects.create(
                mark=1,
                movie=self.movie1,
                user=self.test_user1
            )
    def test_unvalid_rating(self):
        url = reverse('movies_app:rate-movie', kwargs={'movie_pk': self.movie1.id})
        self.user2_auth()
        res = self.client.post(url, {'mark': 489})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_db_unvalid_rating(self):
        with self.assertRaises(ValidationError, msg='Rating must be between 1 and 10'):
            rating = Rating.objects.create(
                mark=489,
                movie=self.movie1,
                user=self.test_user2
            )
            rating.full_clean()


class ReviewTest(TestSetUp):

    def test_user_create_review(self):
        url = reverse('movies_app:reviews')
        self.user2_auth()
        res = self.client.post(url, 
            {'title': 'amesome', 'review_text': 'jabberwocky', 'movie': self.movie1.id})
        review = Review.objects.get(id=res.data['id'])
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(review.author, self.test_user2)
    
    def test_one_movie_one_review(self):
        url = reverse('movies_app:reviews')
        self.user1_auth()
        res = self.client.post(url, 
            {'title': 'amesome', 'review_text': 'jabberwocky', 'movie': self.movie1.id})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_db_one_movie_one_review(self):
        msg="User can't make more than one review for one movie"
        with self.assertRaises(IntegrityError, msg=msg):
            Review.objects.create(
                title='amesome',
                review_text='jabberwocky',
                movie=self.movie1,
                author=self.test_user1
            )        
    
    def test_unauth_create_review(self):
        url = reverse('movies_app:reviews')
        res = self.client.post(url, 
            {'title': 'amesome', 'review_text': 'jabberwocky', 'movie': self.movie1.id})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_review(self):
        url = reverse('movies_app:review-detail', kwargs={'pk':self.review1.id})
        new_text = 'jabberwocky'
        self.user1_auth()
        res = self.client.patch(url, {'review_text': new_text})
        review = Review.objects.get(id=self.review1.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(review.review_text, new_text)
    
    def test_update_other_review(self):
        url = reverse('movies_app:review-detail', kwargs={'pk':self.review2.id})
        new_text = 'jabberwocky'
        self.user1_auth()
        res = self.client.patch(url, {'review_text': new_text})
        review = Review.objects.get(id=self.review2.id)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(review.review_text, new_text)

    def test_user_delete_review(self):
        url = reverse('movies_app:review-detail', kwargs={'pk':self.review2.id})
        self.user2_auth()
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(ObjectDoesNotExist):
            Review.objects.get(id=self.review2.id)

    def test_user_delete_not_his_review(self):
        url = reverse('movies_app:review-detail', kwargs={'pk':self.review2.id})
        self.user1_auth()
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_approve_review(self):
        url = reverse('movies_app:admin-review-approve', kwargs={'pk':self.review1.id})
        self.admin_auth()
        res = self.client.patch(url, {'approved': True})
        review = Review.objects.get(id=self.review1.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(review.approved)
    
    def test_user_approve_review(self):
        url = reverse('movies_app:admin-review-approve', kwargs={'pk':self.review1.id})
        self.user1_auth()
        res = self.client.patch(url, {'approved': True})
        review = Review.objects.get(id=self.review1.id)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(review.approved) 
    
    def test_admin_remove_review(self):
        url = reverse('movies_app:admin-review-remove', kwargs={'pk':self.review1.id})
        self.admin_auth()
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(ObjectDoesNotExist):
            Review.objects.get(id=self.review1.id)


class SearchTest(TestSetUp):
    
    def test_blank_search(self):
        search_qry = ''
        url = reverse('movies_app:search')
        res = self.client.post(url, {'search_qry': search_qry})
        self.assertIsNotNone(res.data.get('empty'))
        self.assertIsNone(res.data.get('movies'))

    def test_valid_search_success(self):
        search_qry = 'movie'
        url = reverse('movies_app:search')
        res = self.client.post(url, {'search_qry': search_qry})
        self.assertContains(res, search_qry)
    
    def test_valid_search_unsuccess(self):
        search_qry = 'jabberwocky'
        url = reverse('movies_app:search')
        res = self.client.post(url, {'search_qry': search_qry})
        self.assertNotContains(res, search_qry)

    def test_valid_exact_search_success(self):
        search_qry = 'staff_name1'
        url = reverse('movies_app:search')
        res = self.client.post(url, {'search_qry': search_qry})
        self.assertContains(res, search_qry)
        self.assertNotContains(res, 'staff_name2')
        self.assertEqual(len(res.data.get('staff')), 1)
        self.assertEqual(len(res.data.get('movies')), 0)


class UserTest(TestSetUp):

    def test_update_profile_photo(self):
        url = reverse('users_app:user-detail', kwargs={'pk': self.test_user1.id})
        self.user1_auth()
        photo = self.create_photo((250, 300))
        res = self.client.patch(url, {'photo': photo})
        self.assertEqual(res.status_code, status.HTTP_200_OK)   

    def test_update_unvalid_profile_photo(self):
        url = reverse('users_app:user-detail', kwargs={'pk': self.test_user1.id})
        self.user1_auth()
        photo = self.create_photo((300, 300))
        res = self.client.patch(url, {'photo': photo})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_success(self):
        url = reverse('users_app:register')
        data = {
            'username':'test_user3',
            'password':'12345y',
            'password2':'12345y',

        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(4, User.objects.count())

    def test_register_password_fail(self):
        url = reverse('users_app:register')
        data = {
            'username':'test_user3',
            'password':'12345y',
            'password2':'1245y',

        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(res.data.get('password'))

    def test_register_email_fail(self):
        url = reverse('users_app:register')
        data = {
            'username':'test_user3',
            'password':'12345y',
            'password2':'12345y',
            'email': 'test_mail@email.com'

        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(res.data.get('email'))

    def test_get_user_rating_stats(self):
        url = reverse('users_app:rating-stats')
        self.user1_auth()
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(4, len(json.loads(res.content)))

    def test_get_user_stats(self):
        url = reverse('users_app:user-stats')
        self.user1_auth()
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(2, len(json.loads(res.content)))

    def test_get_current_user(self):
        url = reverse('users_app:current-user')
        self.user1_auth()
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(self.test_user1.id, json.loads(res.content)['uid'])


    

      


        



        




