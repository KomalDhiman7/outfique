import React, { useEffect, useState } from 'react';
import './Suggestions.scss';
import WeatherCard from '../components/WeatherCard';
import UploadSuggestor from '../components/UploadSuggestor';

const Suggestions = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace this with your actual key
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

          const response = await fetch(url);
          if (!response.ok) throw new Error("Weather API error");

          const data = await response.json();
          setWeather(data);
        } catch (err) {
          console.error("Failed to fetch weather:", err);
          setError('Couldn’t fetch weather right now 😢');
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        console.error("Geolocation error:", geoErr);
        setError('Please enable location to get weather-based fits ⚠️');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="suggestions-page">
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
