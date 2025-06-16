import React from 'react';
import PostCard from '../components/PostCard';
import './Home.scss';

const dummyPosts = [
  {
    image: 'https://i.pinimg.com/564x/1c/bb/e4/1cbbe4517c0a1f8de290e15e2e7e2430.jpg',
    userImage: 'https://i.pravatar.cc/150?img=3',
    username: 'stylebabe_01'
  },
  {
    image: 'https://i.pinimg.com/564x/2e/51/2c/2e512cd25516a1a2e0b83e01b160e256.jpg',
    userImage: 'https://i.pravatar.cc/150?img=5',
    username: 'outfitwitch'
  },
  {
    image: 'https://i.pinimg.com/564x/e2/06/bc/e206bc37c0e1e8ebdb764f059087347f.jpg',
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
