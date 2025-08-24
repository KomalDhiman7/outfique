import React, { useState } from 'react';
import { supabase } from '../supabase';

function WardrobeUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('wardrobe')
      .upload(fileName, file);

    if (error) {
      alert('Upload failed:', error.message);
    } else {
      const { data: publicUrl } = supabase.storage
        .from('wardrobe')
        .getPublicUrl(fileName);
      setUploadedUrl(publicUrl.publicUrl);
    }

    setUploading(false);
  };

  return (
    <div className="uploader">
      <h3>Upload Clothing Image</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadedUrl && (
        <div className="preview">
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded item" style={{ width: 200, borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
}

export default WardrobeUploader;
