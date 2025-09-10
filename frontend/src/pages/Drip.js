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

      const user = supabase.auth.getUser?.() || supabase.auth.user?.();
      if (!user) throw new Error("User not logged in");

      // 1️⃣ Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `wardrobe/${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("wardrobe")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2️⃣ Insert into wardrobe_items table to get item_id
      const { data: itemData, error: insertError } = await supabase
        .from("wardrobe_items")
        .insert({
          user_id: user.id,
          image_path: fileName,
          category: "unclassified",
          created_at: new Date(),
        })
        .select();

      if (insertError || !itemData?.length) throw insertError || new Error("Failed to insert wardrobe item");

      const itemId = itemData[0].id;

      // 3️⃣ Send item_id to backend /api/drip/rate
      const token = localStorage.getItem("token"); // adjust if you store token differently
      const result = await rateDrip(token, [itemId], "Clear", "Happy");

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
