import { useDeferredValue, useEffect, useState } from 'react'
import axios from 'axios';
import './WeatherAnalysis.css';
import Swal from 'sweetalert2';

// IMAGES 

import searchIcon from "@/assets/search.png";
import clearIcon from "@/assets/clear.png";
import cloudIcon from "@/assets/cloud.png";
import drizzleIcon from "@/assets/drizzle.png";
import rainIcon from "@/assets/rain.png";
import windIcon from "@/assets/wind1.png";
import snowIcon from "@/assets/snow.png";
import humidityIcon from "@/assets/humidity.png";

// import defaultWeatherIcon from './assets/default.png';


const WeatherDeatils = ({icon, temp, city, country, lat, long, humidity, wind}) =>{
  return(
    <>
  <div className='image'>
    <img src={icon} alt='Image'/>
  </div>
  <div className='temp'>{temp}°C</div>
  <div className='location'>{city}</div>
  <div className='country'>{country}</div>
  <div className='cord'>
    <div>
      <span className='lat'>Lattitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className='lat'>Longitude</span>
      <span>{long}</span>
    </div>
  </div>
  <div className='data-container'>
    <div className='element'>
      <img src={humidityIcon} alt='humidity' className='icon'/>
      <div className='data'>
        <div className='humidity-percentage'> {humidity} %</div>
        <div className='text'>Humidity</div>
      </div>
    </div>
    <div className='element'>
      <img src={windIcon} alt='wind' className='icon'/>
      <div className='data'>
        <div className='wind-speed'> {wind} Km/h</div>
        <div className='text'>Wind Speed</div>
      </div>
    </div>
  </div>
  </>
  )

};

const WeatherAnalysis = () => {
  const [text , setText] = useState("Coimbatore")
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Coimbatore");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(76);
  const [wind, setWind] = useState(3.5);
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [extremeWeather, setExteremeWeather] = useState("")
  const [error, setError] = useState(null);


  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async (e) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/weather/',
        { city: text }, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = response.data;
      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }
        setTemp(data.temp);
        setHumidity(data.humidity);
        setWind(data.wind_speed);
        setCity(data.city);
        setCountry(data.country);
        setLat(data.lat);
        setLong(data.lon);
        const weatherIconCode = data.weather_icon;
        setIcon(weatherIconMap[weatherIconCode] || clearIcon)
        setCityNotFound(false);
        if (data.alert && data.extremeWeather !== '' && data.alert !== 'No extreme weather conditions.') {
          Swal.fire({
            title: 'Extreme Weather Alert!',
            text: data.alert,
            icon: 'warning',
            confirmButtonText: 'Okay',
            confirmButtonText: 'Okay',
            backdrop: true,
            allowOutsideClick: false, 
            customClass: {
              popup: 'custom-sweetalert-popup', 
            },
            willOpen: () => {
              document.body.style.overflow = 'hidden'; 
            },
            willClose: () => {
              document.body.style.overflow = '';
            }
          });
        }

      } catch (err) {
        setCityNotFound(true);
      } finally {
        setLoading(false);
      }
  };


const getCity = (e) => {
  setText(e.target.value)
}

const handleKeyDown = (e) => {
  if (e.key === "Enter"){
    search();
  }
}

useEffect(function (){
  search();
}, []);

  return (
    <>
    <div className='container'>
      <div className='input-container'> 
        <input type="text" className='cityInput' placeholder='Search City' onChange={getCity} value={text} onKeyDown={handleKeyDown}/>
        <div className='search-icon' onClick={() => search()}>
          <img src={searchIcon} alt="search" />
        </div>
      </div>
      {!loading && !cityNotFound && <WeatherDeatils icon={icon} temp={temp} city={city} country={country}lat={lat} long={long} humidity={humidity} wind={wind} />}

      {loading && <div className='loading-message'>Loading...</div>}
      {error && <div className='error-message'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City Not Found</div>}

      <p className='copyright'>
        Developed by <span>FluidStructure</span>
      </p>
    </div>
    </>      
  )
};

export default WeatherAnalysis;
