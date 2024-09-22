# weather/serializers.py
from rest_framework import serializers
from .models import FavoriteCity
from .models import WeatherData

class FavoriteCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteCity
        fields = ['id', 'city_name', 'country_code']


class WeatherDataSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.city_name', read_only=True)

    class Meta:
        model = WeatherData
        fields = ['city_name', 'temperature', 'humidity', 'wind_speed', 'timestamp']

    def to_representation(self, instance):
        """Customize the representation of the data."""
        representation = super().to_representation(instance)
        representation['city_name'] = instance.city.city_name 
        return representation
