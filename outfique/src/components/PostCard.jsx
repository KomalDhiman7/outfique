import React from 'react';
import './PostCard.scss';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.userImage} alt="user" className="avatar" />
        <span className="username">@{post.username}</span>
      </div>

      <img src={post.image} alt="outfit" className="post-image" />

      <div className="post-actions">
        <span>❤️</span>
        <span>💬</span>
        <span>📌</span>
        <span>⋯</span>
      </div>
    </div>
  );
};

export default PostCard;
