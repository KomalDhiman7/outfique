import React, { useEffect, useState } from 'react';
import './WeatherCard.scss';

const WeatherCard = ({ weather }) => {
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    if (!weather || !weather.main) return;

    const temp = weather.main.temp;

    if (temp < 15) {
      setSuggestion("Layer up with a cute trench and knee-high boots 🧥");
    } else if (temp > 30) {
      setSuggestion("Rock a crop top and linen shorts 🌞");
    } else {
      setSuggestion("Casual jeans and a breezy shirt 💁‍♀️");
    }
  }, [weather]);

  if (!weather || !weather.main) {
    return <div className="weather-card">No weather data available 💔</div>;
  }

  return (
    <div className="weather-card">
      <h3>Today’s Weather in {weather.name}</h3>
      <p>Condition: {weather.weather[0].main}</p>
      <p>Temperature: {Math.round(weather.main.temp)}°C</p>
      <div className="suggestion">💡 {suggestion}</div>
    </div>
  );
};

export default WeatherCard;
