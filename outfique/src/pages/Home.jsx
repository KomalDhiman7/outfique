import React from 'react';
import PostCard from '../components/PostCard';
import './Home.scss';

const dummyPosts = [
  {
    image: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg',
    userImage: 'https://i.pravatar.cc/150?img=3',
    username: 'stylebabe_01'
  },
  {
    image: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg',
    userImage: 'https://i.pravatar.cc/150?img=5',
    username: 'outfitwitch'
  },
  {
    image: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg',
    userImage: 'https://i.pravatar.cc/150?img=6',
    username: 'ootdqueen'
  }
];

const Home = () => {
  return (
    <div className="home-feed">
      {dummyPosts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  );
};

export default Home;
