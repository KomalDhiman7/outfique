import React, { useState } from 'react';
import './Search.scss';
import OutfitCard from '../components/OutfitCard';



const dummyPosts = [
  {
    id: 1,
    user: "KomalSlays",
    image: "/assets/fit1.jpg",
    caption: "Date night slay ✨",
  },
  {
    id: 2,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 3,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 4,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 5,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 6,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 7,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 8,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 9,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 10,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 11,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 12,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 13,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  {
    id: 14,
    user: "Stylista33",
    image: "/assets/fit2.jpg",
    caption: "Chillin' but make it chic",
  },
  // add more dummy data
];
const tags = ['casual', 'party', 'college', 'winter', 'formal', 'nightout', 'work'];

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const filteredPosts = dummyPosts.filter((post) =>
    (!activeTag || post.tags?.includes(activeTag)) &&
    post.user.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-page">
      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar"
      />

      <div className="tag-filter">
        {tags.map(tag => (
          <button
            key={tag}
            className={activeTag === tag ? 'active-tag' : ''}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="outfit-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <OutfitCard key={post.id} post={post} />
          ))
        ) : (
          <p className="no-results">No outfits found matching that vibe 😔</p>
        )}
      </div>
    </div>
  );
};

export default Search;