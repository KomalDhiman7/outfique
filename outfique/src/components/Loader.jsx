import React, { useEffect, useState } from 'react';
import './Loader.scss';

const captions = [
  "Serving looks in 3... 2... 💃",
  "Dressing up like you owe rent 💸",
  "Mood: Slay or stay in 🧥",
  "Outfits loading... enemies trembling 👠",
  "Styling like a revenge arc 🔥",
  "Giving Pinterest but make it personal 📌"
];

const Loader = () => {
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const random = Math.floor(Math.random() * captions.length);
    setCaption(captions[random]);
  }, []);

  return (
    <div className="loader-container">
      <p className="loader-caption">{caption}</p>
    </div>
  );
};

export default Loader;
