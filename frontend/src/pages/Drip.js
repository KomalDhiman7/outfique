import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { uploadCloth, getWardrobe, analyzeDrip, rateDrip } from '../api';
import './Drip.css';

const Drip = () => {
  const { user, loading } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dripScore, setDripScore] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      // Reset states when new file is selected
      setDripScore(null);
      setSuggestions(null);
      setUploadError(null);
    }
  };

  const handleGetSuggestions = async () => {
    if (!file) {
      setUploadError('Please select an image first!');
      return;
    }

    try {
      setAnalyzing(true);
      setUploadError(null);
      
      // Call the API helper which uses the configured API base URL.
      let data;
      try {
        data = await analyzeDrip(user?.access_token, file);
      } catch (err) {
        setUploadError(`Analysis error: ${err.message}`);
        setAnalyzing(false);
        return;
      }
      
      // Transform backend response into a simple list of suggestion strings
      const mappedText = (data.suggestions || []).slice(0, 8).map((s, i) => {
        // support multiple possible shapes from backend
        if (typeof s === 'string') return s;
        if (s.name) return s.name;
        if (s.suggestion) return s.suggestion;
        // try to build a readable label from color/category
        const parts = [s.color, s.category, s.material].filter(Boolean);
        return parts.length ? parts.join(' ') : `Suggested item ${i + 1}`;
      });

      setSuggestions(mappedText.length ? mappedText : null);
      
    } catch (err) {
      setUploadError('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGetDripScore = async () => {
    if (!file) {
      setUploadError('Please select an image first!');
      return;
    }

    try {
      setAnalyzing(true);
      setUploadError(null);
      
      // Call backend to compute drip score. Send auth header only if present.
      try {
        const result = await rateDrip(user?.access_token, file);
        setDripScore(result?.score ?? null);
      } catch (err) {
        setUploadError(`Drip rating error: ${err.message}`);
      }
      
    } catch (err) {
      setUploadError('Failed to calculate drip score. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddToWardrobe = async () => {
    if (!file) {
      setUploadError('Please select an image first!');
      return;
    }

    if (!user) {
      setUploadError('Please login to save items to your wardrobe.');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      
      await uploadCloth(user.access_token, file);
      const items = await getWardrobe(user.access_token);
      setWardrobeItems(items);
      
    } catch (err) {
      setUploadError('Failed to add to wardrobe. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Note: don't block rendering when auth is loading or user is missing.
  // We show the full UI so users can upload and get suggestions/drip score even
  // when not logged in. Saving to wardrobe requires login.

  return (
    <div className="drip-container">
      <div className="content-wrapper">
        <h2 className="drip-title">✨ Style Your Drip ✨</h2>

        {/* lightweight banner: encourage login but don't block features */}
        {!user && (
          <div className="auth-banner">
            <p>
              You are not logged in — suggestions and drip score work without login. To save items to
              your wardrobe please sign in.
            </p>
          </div>
        )}

        <div className="upload-section">
          <label className="file-input-label">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="file-input"
            />
            <span>{file ? '📸 Change photo' : '📸 Choose photo'}</span>
          </label>
          
          {preview && (
            <div className="preview-box">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <div className="action-buttons">
            <button 
              className="action-btn suggest-btn" 
              onClick={handleGetSuggestions} 
              disabled={analyzing || !file}
            >
              {analyzing ? '🔍 Analyzing...' : '🎯 Get Suggestions'}
            </button>

            <button 
              className="action-btn score-btn" 
              onClick={handleGetDripScore} 
              disabled={analyzing || !file}
            >
              {analyzing ? '⏳ Calculating...' : '⭐ Get Drip Score'}
            </button>

            <button 
              className="action-btn save-btn" 
              onClick={handleAddToWardrobe} 
              disabled={uploading || !file}
            >
              {uploading ? '💾 Saving...' : '👔 Add to Wardrobe'}
            </button>
          </div>

          {uploadError && (
            <div className="error-message">
              {uploadError}
            </div>
          )}
        </div>

        {suggestions && (
          <div className="suggestions-section">
            <h3>Suggested Matches</h3>
            <div className="suggestion-list-wrapper">
              <ul className="suggestion-list">
                {suggestions.map((label, idx) => (
                  <li key={idx} className="suggestion-list-item">{label}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {dripScore && (
          <div className="score-section">
            <h3>Drip Score: {dripScore}/10 🔥</h3>
          </div>
        )}

        {wardrobeItems.length > 0 && (
          <div className="wardrobe-section">
            <h3>My Wardrobe</h3>
            <div className="wardrobe-grid">
              {wardrobeItems.map(item => (
                <div key={item.id} className="wardrobe-item">
                  <img src={item.image} alt={item.description || 'Wardrobe item'} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drip;