import React, { useState } from "react";
import { supabase } from "../supabase"; // make sure supabase client is set up
import axios from "axios";
import "./Drip.css";

function Drip() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("📷 Please upload an image first!");
      return;
    }

    try {
      setLoading(true);

      // ✅ Step 1: Upload file to Supabase storage
      const fileName = `drip/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("wardrobe") // 👈 your Supabase bucket name
        .upload(fileName, file);

      if (error) throw error;

      // ✅ Step 2: Get public URL
      const { data } = supabase.storage
        .from("wardrobe")
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      // ✅ Step 3: Send image URL to Flask for analysis
      const res = await axios.post("http://localhost:5000/api/drip", {
        image_url: publicUrl,
      });

      setSuggestion(res.data.suggestion);
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
            Try adding: <b>{suggestion.recommended_item.name}</b>
          </p>
          <div className="product-card">
            <img
              src={suggestion.recommended_item.image}
              alt={suggestion.recommended_item.name}
            />
            <a
              href={suggestion.recommended_item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="myntra-btn">🛍 Buy on Myntra</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drip;
