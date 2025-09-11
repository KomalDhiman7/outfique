// src/pages/Drip.js
import React, { useState } from "react";
import { supabase } from "../supabase";
import { rateDrip } from "../api";
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

    // 1. Upload file to Supabase
    const fileName = `drip/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("wardrobe")
      .upload(fileName, file);

    if (error) throw error;

    // 2. Get public URL
    const { data } = supabase.storage.from("wardrobe").getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    // 3. Insert into wardrobe_items via backend
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}/api/wardrobe/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        image_url: publicUrl,
        category: "top", // optional → let user pick later
        color: "unknown",
        notes: "uploaded via Drip",
      }),
    });

    if (!res.ok) throw new Error("Failed to add wardrobe item");
    const newItem = await res.json();

    // 4. Call backend drip rating API with item_id
    const result = await rateDrip(token, [newItem.id], "Clear", "Happy");

    setSuggestion(result);
  } catch (err) {
    alert("❌ Upload failed: " + err.message);
  } finally {
    setLoading(false);
  }
};


    //  const itemId = itemData[0].id;

  //     // 3️⃣ Send item_id to backend /api/drip/rate
  //     const token = localStorage.getItem("token"); // adjust if you store token differently
  //     const result = await rateDrip(token, [itemId], "Clear", "Happy");

  //     setSuggestion(result);

  //   } catch (err) {
  //     alert("❌ Upload failed: " + err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
          {suggestion.recommended_item && (
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
          )}
        </div>
      )}
    </div>
  );
}

export default Drip;
