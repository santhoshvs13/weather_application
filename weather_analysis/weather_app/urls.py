from django.urls import path
from .views import WeatherAPIView,FavoriteCityListCreate, FavoriteCityDetail, WeatherDataAPIView

urlpatterns = [
    path('favorites/', FavoriteCityListCreate.as_view(), name='favorite-city-list-create'),
    path('favorites/<int:pk>/', FavoriteCityDetail.as_view(), name='favorite-city-detail'),
    path('weather/', WeatherAPIView.as_view(), name='weather_api'),
    path('weather_data/', WeatherDataAPIView.as_view(), name='weather_data'),

]
