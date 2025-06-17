import React, { useEffect, useState } from 'react';
import './Suggestions.scss';
import WeatherCard from '../components/WeatherCard';
import UploadSuggestor from '../components/UploadSuggestor';

const Suggestions = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cityInput, setCityInput] = useState('');
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async ({ lat = null, lon = null, cityName = null }) => {
    setLoading(true);
    setError('');
    try {
      let url = '';

      if (cityName) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
      } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      } else {
        throw new Error('No location data provided');
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather API error');

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError('Couldn’t fetch weather right now 😢');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather({ lat: latitude, lon: longitude });
      },
      (geoErr) => {
        console.error('Geolocation error:', geoErr);
        setError('Please enable location to get weather-based fits ⚠️');
        setLoading(false);
      }
    );
  }, []);

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (!cityInput.trim()) {
      alert('Type a city name first bestie 😭');
      return;
    }
    fetchWeather({ cityName: cityInput.trim() });
    setCityInput('');
  };

  return (
    <div className="suggestions-page">
      <form onSubmit={handleCitySearch} className="city-search-form">
        <input
          type="text"
          value={cityInput}
          placeholder="Wanna check weather somewhere else?"
          onChange={(e) => setCityInput(e.target.value)}
          className="city-input"
        />
        <button type="submit" className="city-search-btn">
          Check ✈️
        </button>
      </form>

      {loading ? (
        <div className="loading-caption">“Fetching vibes from the sky ☁️”</div>
      ) : (
        <div className="suggestions-grid">
          <div className="weather-suggestions">
            {error ? (
              <div className="weather-error">{error}</div>
            ) : (
              <WeatherCard weather={weather} />
            )}
          </div>
          <div className="upload-suggestions">
            <UploadSuggestor />
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
