import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [mood, setMood] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('feed');
  
  // Upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [outfitCaption, setOutfitCaption] = useState('');
  const [outfitHashtags, setOutfitHashtags] = useState('');
  const [selectedMoodForUpload, setSelectedMoodForUpload] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const token = localStorage.getItem('token');
  const moods = ['Fun', 'Party', 'Sleep', 'Beach', 'Mountains', 'Happy'];
  
  const stories = [
    { id: 'your', title: 'Your Story', isAddStory: true },
    { id: 1, title: 'Summer Vibes', image: '/api/placeholder/80/80' },
    { id: 2, title: 'Office Chic', image: '/api/placeholder/80/80' },
    { id: 3, title: 'Weekend Casual', image: '/api/placeholder/80/80' },
  ];

  // Mock posts data
  const mockPosts = [
    {
      id: 1,
      image: '/api/placeholder/300/400',
      caption: 'Summer vibes ✨',
      mood: 'Beach',
      likes: 124,
      comments: 8,
      saves: 32,
      hashtags: ['summer', 'casual', 'chic', 'outfit', 'style'],
      isLiked: false
    },
    {
      id: 2,
      image: '/api/placeholder/300/350',
      caption: 'Office ready 💼',
      mood: 'Happy',
      likes: 89,
      comments: 12,
      saves: 45,
      hashtags: ['formal', 'elegant', 'office', 'professional'],
      isLiked: true
    },
    {
      id: 3,
      image: '/api/placeholder/300/450',
      caption: 'Weekend mood 🌸',
      mood: 'Fun',
      likes: 156,
      comments: 23,
      saves: 67,
      hashtags: ['weekend', 'casual', 'pink', 'girly', 'aesthetic'],
      isLiked: false
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const handleMoodSelect = async (m) => {
    setMood(m);
  };

  const handleDoubleTapLike = async (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
        : post
    ));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOutfitUpload = async () => {
    if (!selectedImage || !outfitCaption || !selectedMoodForUpload) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsUploading(true);
    setTimeout(() => {
      alert('Outfit posted successfully!');
      setSelectedImage(null);
      setImagePreview(null);
      setOutfitCaption('');
      setOutfitHashtags('');
      setSelectedMoodForUpload('');
      setActiveTab('feed');
      setIsUploading(false);
    }, 2000);
  };

  const PostCard = ({ post }) => (
    <div 
      className="post-card"
      onDoubleClick={() => handleDoubleTapLike(post.id)}
    >
      <div className="post-image-container">
        <img src={post.image} alt={post.caption} className="post-image" />
        <div className="post-overlay">
          <button className="overlay-btn save-btn">Save</button>
          <button className="overlay-btn try-btn">Try Similar</button>
        </div>
      </div>
      
      <div className="post-content">
        <h3 className="post-caption">{post.caption}</h3>
        <p className="post-mood">#{post.mood}</p>
        
        <div className="hashtags-container">
          {post.hashtags?.slice(0, 5).map((tag, idx) => (
            <span key={idx} className="hashtag">#{tag}</span>
          ))}
        </div>

        <div className="engagement-bar">
          <button 
            onClick={() => handleDoubleTapLike(post.id)}
            className={`engagement-btn ${post.isLiked ? 'liked' : ''}`}
          >
            {post.isLiked ? '❤️' : '🤍'} {post.likes}
          </button>
          <button className="engagement-btn">💬 {post.comments}</button>
          <button className="engagement-btn">🔖 {post.saves}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`home-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="home-container">
        {/* Simple Header */}
        <div className="header-section">
          <h1 className="greeting">Hey {username}! 👋</h1>
          <p className="tagline">Share your style, discover trends</p>
        </div>

        {/* Mood Selection */}
        <div className="mood-section">
          <h3 className="section-title">What's your vibe?</h3>
          <div className="mood-tags">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => handleMoodSelect(m)}
                className={`mood-tag ${mood === m ? 'active' : ''}`}
              >
                #{m}
              </button>
            ))}
          </div>
        </div>

        {/* Stories */}
        <div className="stories-section">
          <div className="stories-scroll">
            {stories.map(story => (
              <div key={story.id} className="story-item">
                <div className={`story-circle ${story.isAddStory ? 'add-story' : ''}`}>
                  {story.isAddStory ? (
                    <span className="add-icon">+</span>
                  ) : (
                    <img src={story.image} alt={story.title} />
                  )}
                </div>
                <span className="story-label">{story.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="nav-section">
          <button
            onClick={() => setActiveTab('feed')}
            className={`nav-button ${activeTab === 'feed' ? 'active' : ''}`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`nav-button ${activeTab === 'upload' ? 'active' : ''}`}
          >
            Post Outfit
          </button>
        </div>

        {/* Content */}
        {activeTab === 'feed' && (
          <div className="feed-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="upload-section">
            <div className="upload-card">
              <h2 className="upload-title">Share Your Look ✨</h2>
              
              <div className="upload-form">
                {/* Image Upload */}
                <div className="form-field">
                  <label className="field-label">Photo</label>
                  <div className="image-upload">
                    {imagePreview ? (
                      <div className="preview-container">
                        <img src={imagePreview} alt="Preview" className="preview-img" />
                        <button
                          onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="file-input" className="upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          id="file-input"
                          hidden
                        />
                        <div className="upload-placeholder">
                          <span className="upload-icon">📸</span>
                          <p>Tap to add photo</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Caption */}
                <div className="form-field">
                  <label className="field-label">Caption</label>
                  <input
                    type="text"
                    value={outfitCaption}
                    onChange={(e) => setOutfitCaption(e.target.value)}
                    placeholder="Describe your outfit..."
                    className="text-input"
                  />
                </div>

                {/* Hashtags */}
                <div className="form-field">
                  <label className="field-label">Hashtags</label>
                  <input
                    type="text"
                    value={outfitHashtags}
                    onChange={(e) => setOutfitHashtags(e.target.value)}
                    placeholder="summer casual chic"
                    className="text-input"
                  />
                </div>

                {/* Mood */}
                <div className="form-field">
                  <label className="field-label">Mood</label>
                  <div className="mood-options">
                    {moods.map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMoodForUpload(m)}
                        className={`mood-option ${selectedMoodForUpload === m ? 'selected' : ''}`}
                      >
                        #{m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleOutfitUpload}
                  className="submit-button"
                  disabled={isUploading || !selectedImage || !outfitCaption || !selectedMoodForUpload}
                >
                  {isUploading ? 'Posting...' : 'Share Outfit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
