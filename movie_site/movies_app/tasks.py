from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template import Template, Context
from django.template.loader import get_template
from .models import Rating
from datetime import date
import calendar

User = get_user_model()


@shared_task
def send_month_stats():
    today = date.today()
    _, num_of_days = calendar.monthrange(today.year, today.month)
    if today.day == num_of_days:
        users = User.objects.exclude(email='')
        ratings = Rating.objects.filter(rate_date__month=today.month, rate_date__year=today.year)
        template = get_template("movies_app/stats.html")
        for user in users:
            user_ratings = ratings.filter(user=user)
            send_mail(
                'Your month statistic',
                template.render(context={'ratings': user_ratings}),
                "movie_site@movie.com",
                [user.email],
                fail_silently=False,
                html_message=template.render(context={'ratings': user_ratings}),
            )
    else:
        return False
