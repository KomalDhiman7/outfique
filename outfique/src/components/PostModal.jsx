import React from 'react';
import './PostModal.scss';

const PostModal = ({ post, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={post.image} alt="Zoomed Outfit" className="modal-image" />
        <div className="modal-info">
          <h2>@{post.username}</h2>
          <p>{post.caption}</p>
          <div className="tags">{post.tags?.map(tag => <span key={tag}>#{tag} </span>)}</div>
          <div className="modal-actions">
            <button>❤️ Like</button>
            <button>💬 Comment</button>
            <button>📌 Save</button>
          </div>
        </div>
        <span className="close-btn" onClick={onClose}>✖</span>
      </div>
    </div>
  );
};

export default PostModal;
