// src/components/LoadingCaption.js
import React, { useEffect, useState } from 'react';
import './LoadingCaption.css';

const CAPTIONS = [
  "Mixing the moodboard just right",
  "Styling like you're about to meet your enemy",
  "Curating the drip, hold tight",
  "Ironing out the vibes",
  "Weaving your outfit plot twist",
  "Smoothing out the seams…",
  "Serving looks in 3… 2…",
  "Threading your main character energy"
];

const LoadingCaption = () => {
  const [caption, setCaption] = useState(CAPTIONS[0]);
  useEffect(() => {
    setCaption(CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)]);
  }, []);
  return (
    <div className="lc-wrap">
      <div className="lc-card">
        <div className="lc-dot" />
        <p className="lc-text">{caption}</p>
      </div>
    </div>
  );
};

export default LoadingCaption;
