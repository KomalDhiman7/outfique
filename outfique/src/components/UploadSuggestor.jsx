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

  const handleUpload = async () => {
    if (!image || !caption) {
      alert('Add both image and a cute lil caption 🥲');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      const res = await fetch('http://127.0.0.1:5000/upload-wardrobe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Uploaded successfully! 🫶');
        console.log(data); // You can use this to show preview or update UI
      } else {
        alert('Upload failed 💔: ' + data.error);
      }
    } catch (err) {
      console.error('Error uploading:', err);
      alert('Server crashed on your slay 😩');
    }

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
