import React, { useState } from 'react';
import './Profile.scss';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [isEditing, setIsEditing] = useState(false);

  const savedOutfits = [
    { id: 1, image: '/assets/fit1.jpg' },
    { id: 2, image: '/assets/fit2.jpg' }
  ];

  const wardrobeItems = [
    { id: 1, name: 'Black Tee', image: '/assets/wardrobe1.jpg' },
    { id: 2, name: 'Denim Skirt', image: '/assets/wardrobe2.jpg' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src="/assets/default-avatar.png" alt="User" className="avatar" />
        <h2>@KomalDhiman</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {isEditing && (
        <div className="edit-profile-form">
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Bio" />
          <button className="save-btn">Save</button>
        </div>
      )}

      <div className="tabs">
        <button onClick={() => setActiveTab('wardrobe')} className={activeTab === 'wardrobe' ? 'active' : ''}>Wardrobe</button>
        <button onClick={() => setActiveTab('saved')} className={activeTab === 'saved' ? 'active' : ''}>Saved</button>
      </div>

      <div className="tab-content">
        {activeTab === 'wardrobe' && (
          <div className="wardrobe-grid">
            {wardrobeItems.map(item => (
              <div key={item.id} className="wardrobe-item">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="saved-grid">
            {savedOutfits.map(outfit => (
              <img key={outfit.id} src={outfit.image} alt="Saved Outfit" className="saved-img" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
