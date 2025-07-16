import React from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';

function Profile() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
