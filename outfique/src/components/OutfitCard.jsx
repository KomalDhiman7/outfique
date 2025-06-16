import React, { useState } from 'react';
import './OutfitCard.scss';
import PostModal from './PostModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const OutfitCard = ({ post }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="outfit-card" onClick={() => setShowModal(true)}>
        <LazyLoadImage
          src={post.image}
          alt="Outfit"
          className="outfit-img"
          effect="blur"
        />
        <div className="caption">{post.caption}</div>
        <div className="user">@{post.user}</div>
      </div>

      {showModal && <PostModal post={post} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default OutfitCard;
