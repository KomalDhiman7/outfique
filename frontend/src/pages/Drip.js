import React, { useState } from "react";
import { uploadCloth, rateDrip } from "../api"; 
import "./Drip.css";

function Drip() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert("📷 Please upload an image first!");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // 1. Upload file → backend → Cloudinary
      const uploadRes = await uploadCloth(token, file, {});
      const publicUrl = uploadRes.image_url;  // ✅ from backend

      // 2. Call drip rating API
      const result = await rateDrip(token, [publicUrl], "Clear", "Happy");
      setSuggestion(result);

    } catch (err) {
      alert("❌ Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drip-container">
      <h2 className="drip-title">✨ Rate Your Drip ✨</h2>

      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div className="preview-box">
            <img src={preview} alt="Preview" />
          </div>
        )}
        <button className="upload-btn" onClick={handleUpload} disabled={loading}>
          {loading ? "⏳ Checking..." : "Get Drip Score"}
        </button>
      </div>

      {suggestion && (
        <div className="suggestion-box">
          <h3>⭐ Outfit Rating: {suggestion.rating}/5</h3>
          <p>
            Try adding: <b>{suggestion.recommended_item?.name}</b>
          </p>
        </div>
      )}
    </div>
  );
}

export default Drip;
