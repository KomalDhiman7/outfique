import React, { useState } from "react";
import "./Drip.css";

function Drip() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dripScore, setDripScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/drip", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setDripScore(data.drip_score);
      setSuggestions(data.suggestions);
    } catch (err) {
      alert("Error uploading image ❌");
      console.error(err);
    }
  };

  return (
    <div className="drip-container">
      <h2 className="drip-title">✨ Rate Your Drip ✨</h2>

      <div className="upload-box">
        {preview ? (
          <img src={preview} alt="Preview" className="preview-img" />
        ) : (
          <p className="upload-placeholder">Upload your outfit photo</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <button className="upload-btn" onClick={handleUpload}>
          Get Drip Score
        </button>
      </div>

      {dripScore !== null && (
        <div className="drip-score">
          <h3>Your Drip Score</h3>
          <p className="score">{dripScore} / 100</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="suggestions">
          <h3>🔥 Style Suggestions</h3>
          <div className="suggestion-list">
            {suggestions.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="suggestion-item"
              >
                <img src={s.image} alt={s.item} />
                <p>{s.item}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Drip;
