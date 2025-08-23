// src/components/LoadingScreen.js - Enhanced version
import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const fashionLoadingMessages = [
  "Styling like you're about to meet your enemy",
  "Smoothing out the seams…",
  "Mixing the moodboard just right",
  "Curating your closet magic",
  "Tailoring the perfect vibe",
  "Weaving style into reality",
  "Adjusting the fashion frequency",
  "Stitching together your story",
  "Pressing out style wrinkles",
  "Threading the needle of fashion"
];

const LoadingScreen = ({ message }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const randomMessage = message || 
      fashionLoadingMessages[Math.floor(Math.random() * fashionLoadingMessages.length)];
    setCurrentMessage(randomMessage);
  }, [message]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="fashion-loader">
          <div className="hanger">
            <div className="hanger-hook"></div>
            <div className="hanger-bar"></div>
          </div>
          <div className="clothing-item">
            <div className="shirt"></div>
          </div>
        </div>
        <p className="loading-message">{currentMessage}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
