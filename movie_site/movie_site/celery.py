import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_site.settings')
app = Celery('movie_site')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'send-email-month-end': {
        'task': 'movies_app.tasks.send_month_stats',
        'schedule': crontab(hour='23',minute='59'),
    },
}