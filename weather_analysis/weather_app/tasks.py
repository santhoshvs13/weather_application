from celery import shared_task
import requests
from .models import FavoriteCity, WeatherData
from django.conf import settings


@shared_task
def fetch_weather_data():
    api_key = settings.WEATHER_API_KEY
    base_url = 'http://api.openweathermap.org/data/2.5/weather'
    
    favorite_cities = FavoriteCity.objects.all()

    for city in favorite_cities:
        params = {
            'q': f"{city.city_name}",
            'appid': api_key,
            'units': 'metric'
        }
        response = requests.get(base_url, params=params)
        data = response.json()

        if response.status_code == 200:
            WeatherData.objects.create(
                city=city,
                temperature=data['main']['temp'],
                humidity=data['main']['humidity'],
                wind_speed=data['wind']['speed']
            )
