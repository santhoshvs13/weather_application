import os
from celery import Celery
from django.conf import settings
from datetime import timedelta


# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'weather_analysis.settings')

celery_app = Celery('weather_analysis')

# Using a string here means the worker does not have to serialize
# the configuration object to child processes.
celery_app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
celery_app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

celery_app.conf.beat_schedule = {
                                'fetch-weather-data-every-hour': {
                                    'task': 'weather_app.tasks.fetch_weather_data',
                                    'schedule': timedelta(hours=1),  
                                },
                            }


