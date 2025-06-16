import React, { useState } from 'react';
import './UploadSuggestor.scss';

const UploadSuggestor = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!image || !caption) {
      alert('Add both image and a cute lil caption 🥲');
      return;
    }
    alert('Upload logic coming soon — slay saved locally 💾✨');
    // Later: hook with backend or Firebase
    setImage(null);
    setPreview(null);
    setCaption('');
  };

  return (
    <div className="upload-suggestor">
      <h3>Upload Your Fit</h3>
      {preview ? (
        <img src={preview} alt="Preview" className="image-preview" />
      ) : (
        <label htmlFor="upload" className="upload-label">
          📸 Click to add your fit
        </label>
      )}
      <input
        id="upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <textarea
        placeholder="Add a slayin' caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <button onClick={handleUpload} className="upload-btn">
        Upload ✨
      </button>
    </div>
  );
};

export default UploadSuggestor;
