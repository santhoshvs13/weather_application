import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Modal from 'react-modal';
import 'chart.js/auto';
import Swal from 'sweetalert2';


Modal.setAppElement('#root');

const WeatherGraph = ({ cityName, isOpen, onClose }) => {


    const [weatherData, setWeatherData] = useState([]);
    const [avgData, setAvgData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWeatherData = async () => {
        if (!cityName) {
        return <div>Error: No city selected</div>;
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/weather_data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ city: cityName })
            });

            const data = await response.json();
            if (data.current_data.length > 0){
                setWeatherData(data.current_data);
                setAvgData(data.avg_data);
                setLoading(false);
            }
            else{
                Swal.fire({
                    title: `${cityName} Weather Details`, // Use the city name from the API response
                    html: `
                      <div class="weather-popup">
                        <div class="popup-coords">Graph Not Available !!, Contact Admin</div>
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
                onClose();

            }
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchWeatherData();
        }
    }, [isOpen, cityName]);

    const labels = weatherData.map(item => {
        const date = new Date(item.timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const tempData = weatherData.map(item => item.temperature);
    const humidityData = weatherData.map(item => item.humidity);
    const windSpeedData = weatherData.map(item => item.wind_speed);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: tempData,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Humidity (%)',
                data: humidityData,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Wind Speed (m/s)',
                data: windSpeedData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Weather Data Graph"
            style={{
                content: {
                    width: '50%',
                    height: '50%',
                    margin: 'auto',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#2c2c2c',
                    color: '#fff',
                    border: '1px solid #555',
                    overflow: 'auto'  // Ensure modal contents are scrollable
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                }
            }}
        >
            <h2 style={{ color: '#fff' }}>Weather Data for {cityName}</h2>
            <button 
                onClick={onClose} 
                style={{ 
                    float: 'right', 
                    padding: '5px 10px', 
                    backgroundColor: '#555', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px' 
                }}
            >
                Close
            </button>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Line 
                        data={chartData}
                        options={{
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { color: '#fff' },
                                    grid: { color: '#555' },
                                },
                                x: {
                                    ticks: { color: '#fff' },
                                    grid: { color: '#555' },
                                },
                            },
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: { color: '#fff' },
                                },
                            },
                        }}
                    />
                    {avgData && (
                        <div style={{ marginTop: '20px', color: '#fff' }}>
                            <strong>Average Data:</strong><br />
                            Temperature: {avgData.avg_temperature.toFixed(2)} °C<br />
                            Humidity: {avgData.avg_humidity.toFixed(2)} %<br />
                            Wind Speed: {avgData.avg_wind_speed.toFixed(2)} m/s
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
};

export default WeatherGraph;
