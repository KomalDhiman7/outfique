// src/pages/Home.js
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import LoadingCaption from '../components/LoadingCaption';
import './Home.css';

const DEFAULT_TAGS = [
  'summer','winter','party','cool','college','work','beach','mountains',
  'street','casual','formal','ethnic','festive','date','travel','sleep',
  'gym','vintage','preppy','classic','minimal','aesthetic','pink','denim'
];

// Curated GIRLIE-only aesthetic images (Unsplash)
const GIRLIE_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546000863-3f0c0f5e58b2?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543429252-8f0143f7de1d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1510867759970-498c1aa1f1ca?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473286835901-04adb1afab03?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'
];

const Home = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [initializing, setInitializing] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [posts, setPosts] = useState([]);

  // Mock feed (girlie only)
  const mockPosts = useMemo(() => ([
    {
      id: 'p1',
      user: { id: 'u1', handle: 'alexa.styles', display: 'Alexa' },
      image: GIRLIE_IMAGES[0],
      caption: 'Beach breeze ✨',
      hashtags: ['summer','beach','casual'],
      likes: 124, comments: 8, saves: 12,
      isLiked: false, isSaved: false
    },
    {
      id: 'p2',
      user: { id: 'u2', handle: 'mira.office', display: 'Mira' },
      image: GIRLIE_IMAGES[1],
      caption: 'Boardroom chic',
      hashtags: ['work','formal','classic'],
      likes: 89, comments: 12, saves: 4,
      isLiked: true, isSaved: true
    },
    {
      id: 'p3',
      user: { id: 'u3', handle: 'ivy.weekend', display: 'Ivy' },
      image: GIRLIE_IMAGES[2],
      caption: 'Cafe crawl fit',
      hashtags: ['college','street','denim'],
      likes: 156, comments: 23, saves: 10,
      isLiked: false, isSaved: false
    },
    {
      id: 'p4',
      user: { id: 'u4', handle: 'noa.nights', display: 'Noa' },
      image: GIRLIE_IMAGES[3],
      caption: 'Night out 🔥',
      hashtags: ['party','cool','preppy'],
      likes: 210, comments: 14, saves: 18,
      isLiked: false, isSaved: false
    },
    {
      id: 'p5',
      user: { id: 'u5', handle: 'zara.vibes', display: 'Zara' },
      image: GIRLIE_IMAGES[4],
      caption: 'Weekend minimal',
      hashtags: ['minimal','aesthetic','classic'],
      likes: 77, comments: 5, saves: 2,
      isLiked: false, isSaved: false
    },
    {
      id: 'p6',
      user: { id: 'u6', handle: 'luna.trips', display: 'Luna' },
      image: GIRLIE_IMAGES[5],
      caption: 'Travel fits only',
      hashtags: ['travel','street','cool'],
      likes: 182, comments: 22, saves: 16,
      isLiked: false, isSaved: false
    },
    {
      id: 'p7',
      user: { id: 'u7', handle: 'nia.ethnic', display: 'Nia' },
      image: GIRLIE_IMAGES[6],
      caption: 'Festive elegance',
      hashtags: ['ethnic','festive','formal'],
      likes: 143, comments: 9, saves: 11,
      isLiked: false, isSaved: false
    },
    {
      id: 'p8',
      user: { id: 'u8', handle: 'kai.gym', display: 'Kai' },
      image: GIRLIE_IMAGES[7],
      caption: 'Gym to street',
      hashtags: ['gym','street','casual'],
      likes: 199, comments: 31, saves: 28,
      isLiked: false, isSaved: false
    },
    {
      id: 'p9',
      user: { id: 'u9', handle: 'ella.pink', display: 'Ella' },
      image: GIRLIE_IMAGES[8],
      caption: 'Pink power',
      hashtags: ['pink','aesthetic','summer'],
      likes: 264, comments: 35, saves: 32,
      isLiked: false, isSaved: false
    },
    {
      id: 'p10',
      user: { id: 'u10', handle: 'sam.mountain', display: 'Sam' },
      image: GIRLIE_IMAGES[9],
      caption: 'Mountain air',
      hashtags: ['mountains','travel','minimal'],
      likes: 122, comments: 7, saves: 6,
      isLiked: false, isSaved: false
    }
  ]), []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPosts(mockPosts);
      setInitializing(false);
    }, 800);
    return () => clearTimeout(t);
  }, [mockPosts]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(p => (p.hashtags || []).some(h => h.toLowerCase() === selectedTag.toLowerCase()));
  }, [posts, selectedTag]);

  const navigateProfile = (uid) => navigate(`/profile?uid=${encodeURIComponent(uid)}`);

  const toggleLike = (postId) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.likes + (p.isLiked ? -1 : 1) } : p
      )
    );
  };
  const toggleSave = (postId) => setPosts(prev => prev.map(p => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p)));
  const copyShareLink = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    try { await navigator.clipboard.writeText(url); alert('Link copied!'); }
    catch { alert(url); }
  };

  // Heart burst on double tap
  const heartRefs = useRef({});
  const onDoubleTap = (postId) => {
    toggleLike(postId);
    const el = heartRefs.current[postId];
    if (el) {
      el.classList.remove('burst');
      void el.offsetWidth;
      el.classList.add('burst');
    }
  };

  if (initializing) return <LoadingCaption />;

  return (
    <div className="home-wrapper">
      <div className="home-container">

        {/* Hashtag rail */}
        <section className="hashtags-rail">
          <div className="tags-scroll">
            {DEFAULT_TAGS.map(tag => (
              <button
                key={tag}
                className={`tag-chip ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
          {selectedTag && (
            <button className="clear-tag" onClick={() => setSelectedTag('')}>Clear</button>
          )}
        </section>

        {/* Vertical masonry feed */}
        <section className="masonry">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">No posts for #{selectedTag}. Try another tag.</div>
          ) : (
            filteredPosts.map(post => (
              <article key={post.id} className="post-card" onDoubleClick={() => onDoubleTap(post.id)}>
                <header className="post-head">
                  <button className="avatar" onClick={() => navigateProfile(post.user.id)} aria-label="Open profile">
                    <span>{post.user.display?.[0]?.toUpperCase() || 'U'}</span>
                  </button>
                  <button className="user-meta" onClick={() => navigateProfile(post.user.id)}>
                    <span className="user-handle">@{post.user.handle}</span>
                  </button>
                  <button className="more-btn" title="More">⋯</button>
                </header>

                <div className="post-media">
                  <img src={post.image} alt={post.caption} />
                  <div className="dbltap-heart" ref={(r) => (heartRefs.current[post.id] = r)}>❤️</div>
                </div>

                <section className="post-body">
                  <h3 className="caption">{post.caption}</h3>

                  {/* single-line clickable hashtags */}
                  <div className="hashtags single-line">
                    {(post.hashtags || []).map(tag => (
                      <button
                        key={tag}
                        className={`hash-link ${selectedTag === tag ? 'active' : ''}`}
                        onClick={() => setSelectedTag(tag)}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  <div className="actions">
                    <button className={`icon-btn ${post.isLiked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                      {post.isLiked ? '❤️' : '🤍'} <span>{post.likes}</span>
                    </button>
                    <button className="icon-btn" onClick={() => alert('Comments coming soon')}>💬 <span>{post.comments}</span></button>
                    <button className="icon-btn" onClick={() => toggleSave(post.id)}>🔖 <span>{post.saves + (post.isSaved ? 1 : 0)}</span></button>
                    <div className="spacer" />
                    <button className="icon-btn" onClick={() => copyShareLink(post.id)}>🔗 Share</button>
                  </div>
                </section>
              </article>
            ))
          )}
        </section>

      </div>
    </div>
  );
};

export default Home;
