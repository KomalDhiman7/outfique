import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doubleTap.css'; // optional CSS for double tap effect

const Home = () => {
  const [weather, setWeather] = useState('32°C');
  const [city, setCity] = useState('Delhi');
  const [username, setUsername] = useState('Komal');
  const [mood, setMood] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  const token = localStorage.getItem('token');

  const moods = ['Fun', 'Party', 'Sleep', 'Beach', 'Mountains', 'Happy'];

  useEffect(() => {
    fetchSuggestions();
    fetchPosts();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('/suggestions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error('Suggestions error', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Posts error', err);
    }
  };

  const handleMoodSelect = async (m) => {
    setMood(m);
    try {
      await axios.post(
        '/mood',
        { mood: m },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Mood error', err);
    }
  };

  const handleDoubleTapLike = (postId) => {
    // TODO: Add API for likes
    console.log('Liked post:', postId);
  };

  const handleSave = async (outfitId) => {
    try {
      await axios.post(
        '/save',
        { outfit_id: outfitId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Saved!');
    } catch (err) {
      alert('Already saved');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-100 to-yellow-100 rounded-xl p-6 mb-6 shadow-md">
        <h2 className="text-xl font-semibold">
          Good afternoon, {username} 🌤️ — it’s {weather} in {city}
        </h2>
        <p className="mt-1">Here's what you could wear today 👗</p>

        {/* Mood Selector */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => handleMoodSelect(m)}
              className={`px-4 py-2 rounded-full border ${
                mood === m ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Outfit Suggestion */}
        <div className="mt-4 p-4 border rounded-md bg-white shadow">
          {suggestions.map((s, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-medium">📦 {s.name}</p>
              <p className="text-sm text-gray-600">Mood: {s.mood}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New Posts Banner */}
      {newPostsAvailable && (
        <div className="bg-green-200 text-center py-2 mb-4 rounded">
          🔄 New outfit suggestions available — Refresh!
        </div>
      )}

      {/* Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative bg-white shadow rounded-lg overflow-hidden group"
            onDoubleClick={() => handleDoubleTapLike(post.id)}
          >
            <img src={post.image} alt={post.caption} className="w-full h-64 object-cover" />

            <div className="p-4">
              <h3 className="text-lg font-semibold">{post.caption}</h3>
              <p className="text-sm text-gray-500">
                Mood: {post.mood} | Weather: {post.weather}
              </p>

              <div className="flex justify-between mt-2 text-gray-700 text-sm">
                <button onClick={() => handleDoubleTapLike(post.id)}>💗 Like</button>
                <button>💬 Comment</button>
                <button onClick={() => handleSave(post.id)}>🔖 Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore / Generator CTA */}
      <div className="mt-10 text-center">
        <button className="bg-black text-white px-6 py-3 rounded-full shadow">
          👕 Remix Outfit from My Wardrobe
        </button>
      </div>

      {/* Saved Carousel, Streak, Tips... you can build next */}
    </div>
  );
};

export default Home;
