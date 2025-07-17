import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Suggestions.css';


function Suggestions() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [inputCity, setInputCity] = useState('');
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [matchingImage, setMatchingImage] = useState(null);

  const moods = ['Party', 'Fun', 'Sleep', 'Happy', 'Beach', 'Mountains'];

  // Replace this with your actual API key
  const API_KEY = '56c845eb908d61f92aebecf35d8b7802';

  const fetchWeather = async (selectedCity) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setCity(selectedCity);
    } catch (err) {
      console.error(err);
      setWeather(null);
    }
  };

  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
        setCity(response.data.name);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      fetchWeather(inputCity);
    }
  };

  const handleSuggest = () => {
    if (!weather || !mood) {
      setSuggestion('Please select a mood and check weather first.');
      return;
    }

    const temp = weather.main.temp;

    let baseSuggestion = '';
    if (temp >= 30) baseSuggestion = 'Skirt with half-sleeves & sneakers';
    else if (temp >= 20) baseSuggestion = 'Jeans and t-shirt with shoes';
    else baseSuggestion = 'Warm sweater, jeans & boots';

    const moodBasedAddOn = {
      Party: 'Add shiny accessories or heels.',
      Fun: 'Try bright colors and comfy sneakers.',
      Sleep: 'Loose t-shirt & shorts or pajamas.',
      Happy: 'Something colorful and flowy.',
      Beach: 'Swimsuit with coverup & flip-flops.',
      Mountains: 'Thermal wear with jacket & boots.'
    };

    const finalSuggestion = `${baseSuggestion} ${moodBasedAddOn[mood] || ''}`;
    setSuggestion(finalSuggestion);

    // Dummy wardrobe color match (you can replace this logic with OpenCV)
    // Let's say if the base is white t-shirt and we have that:
    if (finalSuggestion.toLowerCase().includes('white')) {
      setMatchingImage('/images/white-tshirt.jpg'); // You should dynamically match with wardrobe DB
    } else {
      setMatchingImage(null);
    }
  };

  useEffect(() => {
    getLocationWeather(); // Auto-fetch on load
  }, []);

  return (
    <div className="suggestions-wrapper">
    <div className="suggestions-container">
      <h2>What Should I Wear Today? 👗</h2>

      {/* Search Box */}
      <div>
        <input
          type="text"
          placeholder="Search city..."
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={getLocationWeather}>Use My Location</button>
      </div>

      {/* Weather Info */}
      {weather && (
        <div className="weather-info">
          <h3>Weather in {city}</h3>
          <p>🌡️ Temperature: {weather.main.temp}°C</p>
          <p>☁️ Condition: {weather.weather[0].description}</p>
        </div>
      )}

      {/* Mood Dropdown */}
      <div>
        <label>Select Mood: </label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">--Select--</option>
          {moods.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Suggestion Button */}
      <button onClick={handleSuggest}>Get Outfit Suggestion</button>

      {/* Suggestion Box */}
      {suggestion && (
        <div className="suggestion-box">
          <h4>💡 Suggestion:</h4>
          <p>{suggestion}</p>
        </div>
      )}

      {/* Matching Outfit Image */}
      {matchingImage && (
        <div className="matching-image">
          <h4>👚 Match from Your Wardrobe:</h4>
          <img src={matchingImage} alt="Suggested from wardrobe" style={{ width: '200px' }} />
        </div>
      )}
    </div>
    </div>
  );
}

export default Suggestions;
