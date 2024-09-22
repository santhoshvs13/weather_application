import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './Favourites.css'; 
import Swal from 'sweetalert2';
import clearIcon from "@/assets/clear.png";
import cloudIcon from "@/assets/cloud.png";
import drizzleIcon from "@/assets/drizzle.png";
import rainIcon from "@/assets/rain.png";
import snowIcon from "@/assets/snow.png";
import WeatherGraph from '../weathergraph/WeatherGraph';
import Modal from 'react-modal';
import 'chart.js/auto';



const FavoriteCityForm = ({ city, onCitySaved }) => {
    const [cityName, setCityName] = useState(city?.city_name || '');
    const [countryCode, setCountryCode] = useState(city?.country_code || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = city
            ? `http://127.0.0.1:8000/api/favorites/${city.id}/`
            : `http://127.0.0.1:8000/api/favorites/`;
        const method = city ? 'put' : 'post';

        axios[method](url, { city_name: cityName, country_code: countryCode })
            .then(() => {
                alert('City saved successfully!');
                setCityName('');
                setCountryCode('');
                onCitySaved();  // Trigger the parent component to refresh the city list
            })
            .catch((error) => console.error('Error saving favorite city:', error));
    };

    return (
        <form onSubmit={handleSubmit} className="form-row">
            <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="City Name"
                required
            />
            <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="Country Code"
                required
            />
            <button type="submit">Save</button>
        </form>
    );
};

const handleWeatherIconClick = async (row, e) => {
    
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
    try {
        // setLoading(true); // Set loading state
        const response = await axios.post(
          'http://127.0.0.1:8000/api/weather/',
          { city: row.city_name }, 
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const data = response.data;

        // Check if city not found
        if (data.cod === "404") {
        //   setCityNotFound(true);
        //   setLoading(false);
          return;
        }

        // Log the response to verify it's correct
        console.log(data);
        const weather_icon = weatherIconMap[data.weather_icon]
        // Using `data` from the response for populating the weather details
        Swal.fire({
            title: `${data.city} Weather Details`, // Use the city name from the API response
            html: `
              <div class="weather-popup">
                <div class="popup-image">
                    <img src="${weather_icon}" alt="Weather Icon" />
                </div>
                <div class="popup-temp">${data.temp}°C</div>
                <div class="popup-humidity">Humidity: ${data.humidity}%</div>
                <div class="popup-wind">Wind Speed: ${data.wind_speed} km/h</div>
                <div class="popup-coords">Coordinates: [${data.lat}, ${data.lon}]</div>
              </div>
            `,
            confirmButtonText: 'Close',
            customClass: {
              popup: 'custom-sweetalert-popup',
            },
            willOpen: () => {
              document.body.style.overflow = 'hidden';
            },
            willClose: () => {
              document.body.style.overflow = '';
            },
            backdrop: true,
            allowOutsideClick: false,
        });

    } catch (err) {
        // setCityNotFound(true); // Handle error if city is not found
    } finally {
        // setLoading(false); // End loading state
    }
};

  
const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchFavorites = () => {
        axios
            .get('http://127.0.0.1:8000/api/favorites/')
            .then((response) => setFavorites(response.data))
            .catch((error) => console.error('Error fetching favorite cities:', error));
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleTrendButtonClick = (cityName) => {
        if (cityName) {
            setSelectedCity(cityName);
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCity(null);  
    };

    const columns = [
        {
            name: 'City Name',
            selector: (row) => row.city_name,
            sortable: true,
        },
        {
            name: 'Country Code',
            selector: (row) => row.country_code,
            sortable: true,
        },
        {
            name: 'Weather Info',
            cell: (row) => (
                <img
                    src={cloudIcon}
                    alt="Weather Icon"
                    className="icon"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleWeatherIconClick(row)}
                />
            ),
            ignoreRowClick: true,
            button: true,
        },
        {
            name: 'Trend',
            cell: (row) => (
                <button
                    className="trend-button"
                    onClick={() => handleTrendButtonClick(row.city_name)}>
                    View Trend
                </button>
            ),
            ignoreRowClick: true,
            button: true,
        },
    ];

    return (
        <div className="favorites-container">
            {selectedCity && (
                <WeatherGraph
                    cityName={selectedCity}
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                />
            )}
            <FavoriteCityForm onCitySaved={fetchFavorites} />
            <div className="table-responsive">
                <DataTable
                    columns={columns}
                    data={favorites}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15]}
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    highlightOnHover
                    selectableRows
                />
            </div>  
        </div>
    );
};

export default Favorites;