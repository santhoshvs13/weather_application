from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .models import WeatherData
from .serializers import WeatherDataSerializer
from django.db.models import Avg
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from rest_framework import generics
from .models import FavoriteCity
from .serializers import FavoriteCitySerializer

class FavoriteCityListCreate(generics.ListCreateAPIView):
    queryset = FavoriteCity.objects.all()
    serializer_class = FavoriteCitySerializer

class FavoriteCityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = FavoriteCity.objects.all()
    serializer_class = FavoriteCitySerializer

def check_for_extreme_weather(temperature, humidity):

    alert_message = ""

    if temperature is not None:
        if temperature > 40:
            alert_message += "Heatwave alert! The temperature is dangerously high. Stay hydrated. "
        elif temperature < 5:
            alert_message += "Cold wave alert! The temperature is extremely low. Stay warm. "

    if humidity is not None:
        if humidity > 85:
            alert_message += "High humidity alert! The humidity is very high. Avoid outdoor activities. "
        elif humidity < 20:
            alert_message += "Low humidity alert! The air is very dry. Keep hydrated and moisturized. "

    if alert_message == "":
        alert_message = "No extreme weather conditions."

    return alert_message

@method_decorator(csrf_exempt, name='dispatch')
class WeatherAPIView(APIView):

    def post(self, request, *args, **kwargs):
        city = request.data.get('city')
        api_key = settings.WEATHER_API_KEY
        if not city:
            return Response({'error': 'City not provided'}, status=status.HTTP_400_BAD_REQUEST)
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            temperature = data['main']['temp']
            humidity = data['main']['humidity']
            wind_speed = data['wind']['speed']
            lattitude = data['coord']['lat']
            longitude = data['coord']['lon']
            country = data['sys']['country']
            city_name = data['name']
            weather_icon = data['weather'][0]['icon']
            alert = check_for_extreme_weather(temperature, humidity)

            weather_data = {
                'city': city_name,
                'temp': temperature,
                'humidity': humidity,
                'wind_speed': wind_speed,
                'country':country,
                'lat': lattitude,
                'lon': longitude,
                'weather_icon': weather_icon,
                'alert': alert
            }

            return Response(weather_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'City not found'}, status=status.HTTP_404_NOT_FOUND)


class WeatherDataAPIView(APIView):
    def post(self, request):
        city_name = request.data.get('city')

        if not city_name:
            return Response({"error": "City name is required."}, status=status.HTTP_400_BAD_REQUEST)

        weather_data = WeatherData.objects.filter(city__city_name=city_name).order_by('-timestamp')[:24]
        avg_data = (weather_data.aggregate(avg_temperature=Avg('temperature'),avg_humidity=Avg('humidity'),
                avg_wind_speed=Avg('wind_speed')))
        

        serializer = WeatherDataSerializer(weather_data, many=True)

        return Response({
                            'current_data': serializer.data,
                            'avg_data': avg_data
                        }, status=status.HTTP_200_OK)