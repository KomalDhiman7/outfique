// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { getWardrobe } from "../api";

// function Profile() {
//   const { user, token } = useContext(AuthContext);
//   const [outfits, setOutfits] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       try {
//         const wardrobeRes = await getWardrobe(token);
//         setOutfits(wardrobeRes.items || []);
//       } catch (err) {
//         console.error("Wardrobe fetch error:", err);
//       }
//       setLoading(false);
//     }
//     if (token) fetchData();
//   }, [token]);

//   if (loading) return <div className="profile-loading">Loading...</div>;

//   return (
//     <div className="profile-page">
//       <h2>My Profile</h2>
//       <div className="profile-header">
//         <img src={user?.avatar_url || "/logo192.png"} alt="avatar" className="profile-avatar" />
//         <div className="profile-username">{user?.username}</div>
//       </div>
//       <h3>Uploaded Outfits</h3>
//       <div className="profile-outfits">
//         {outfits.length === 0 ? (
//           <div>No outfits uploaded yet.</div>
//         ) : (
//           outfits.map((item) => (
//             <div key={item.id} className="profile-outfit-card">
//               <img src={item.image_path} alt="outfit" className="profile-outfit-img" />
//               <div>{item.category}</div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please login to view your profile</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {/* Your profile content */}
    </div>
  );
};

export default Profile;