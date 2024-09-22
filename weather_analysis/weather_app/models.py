from django.db import models

class FavoriteCity(models.Model):
    city_name = models.CharField(max_length=100)
    country_code = models.CharField(max_length=5)
    desc = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.city_name}, {self.country_code}"

class WeatherData(models.Model):
    city = models.ForeignKey(FavoriteCity, on_delete=models.CASCADE)
    temperature = models.FloatField()
    humidity = models.FloatField()
    wind_speed = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Weather in {self.city} at {self.timestamp}"
