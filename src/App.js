import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [hourlyData, setHourlyData] = useState([]);
  const [location, setLocation] = useState('');
  const [background, setBackground] = useState('default.jpg');
  const [loading, setLoading] = useState(false); // State to manage loading status

  const apiKey = '306695374f08990deab462dbaac64eae';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      setLoading(true); // Set loading to true when fetching data
      axios.get(weatherUrl)
        .then((response) => {
          setData(response.data);
          setLocation('');
        })
        .catch((error) => {
          console.error('Error fetching the weather data:', error);
        });

      axios.get(forecastUrl)
        .then((response) => {
          setHourlyData(response.data.list);
          setLoading(false); // Set loading to false after fetching
        })
        .catch((error) => {
          console.error('Error fetching the forecast data:', error);
          setLoading(false); // Ensure loading is false on error
        });
    }
  };

  useEffect(() => {
    if (data.weather) {
      switch (data.weather[0].main) {
        case 'Clear':
          setBackground('clear.jpg');
          break;
        case 'Rain':
          setBackground('rainy.jpg');
          break;
        case 'Snow':
          setBackground('snow.jpg');
          break;
        case 'Clouds':
          setBackground('cloudy.jpg');
          break;
        case 'Sunset':
          setBackground('sunset.jpg');
          break;
        default:
          setBackground('default.jpg');
          break;
      }
    }
  }, [data]);

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <h1 className='title'>Weather App</h1>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()} m/s</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>

      {/* Hourly Forecast Section */}
      {loading ? ( // Display skeleton loader while loading
        <div className="skeleton-loader">
          <h2>Loading...</h2>
        </div>
      ) : (
        <>
          <h2>Hourly Forecast</h2>
          {hourlyData.length > 0 && (
            <div className="hourly-forecast">
              <div className="hourly-container">
                {hourlyData.slice(0, 8).map((hour, index) => (
                  <div key={index} className="hour">
                    <p>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>{hour.main.temp.toFixed()}°C</p>
                    <p>{hour.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
