from flask import Blueprint, request, jsonify, abort
from backend.extensions import db
from backend.models.user import User
from backend.models.social import Follow, Like, Save, Comment
from backend.models.post import Post
from backend.utils.notifications import create_notification
from flask_jwt_extended import jwt_required, get_jwt_identity

social_bp = Blueprint('social', __name__)


def current_user_id():
    """Helper to get logged-in user ID from JWT"""
    return get_jwt_identity()


@social_bp.post('/follow/<int:target_id>')
@jwt_required()
def follow_user(target_id):
    uid = current_user_id()
    if uid == target_id:
        abort(400, description='Cannot follow yourself')

    exists = Follow.query.filter_by(follower_id=uid, following_id=target_id).first()
    if exists:
        # unfollow
        db.session.delete(exists)
        db.session.commit()
        return {"status": "unfollowed"}

    f = Follow(follower_id=uid, following_id=target_id)
    db.session.add(f)
    db.session.commit()
    create_notification(uid, target_id, 'follow')
    return {"status": "followed"}


@social_bp.post('/like/<int:post_id>')
@jwt_required()
def like_post(post_id):
    uid = current_user_id()
    existing = Like.query.filter_by(user_id=uid, post_id=post_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return {"status": "unliked"}

    like = Like(user_id=uid, post_id=post_id)
    db.session.add(like)
    db.session.commit()
    post = Post.query.get_or_404(post_id)
    create_notification(uid, post.user_id, 'like', post_id=post_id)
    return {"status": "liked"}


@social_bp.post('/save/<int:post_id>')
@jwt_required()
def save_post(post_id):
    uid = current_user_id()
    existing = Save.query.filter_by(user_id=uid, post_id=post_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return {"status": "unsaved"}

    s = Save(user_id=uid, post_id=post_id)
    db.session.add(s)
    db.session.commit()
    post = Post.query.get_or_404(post_id)
    create_notification(uid, post.user_id, 'save', post_id=post_id)
    return {"status": "saved"}


@social_bp.post('/comment/<int:post_id>')
@jwt_required()
def comment_post(post_id):
    uid = current_user_id()
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    if not text:
        abort(400, description='Comment text required')

    c = Comment(user_id=uid, post_id=post_id, text=text)
    db.session.add(c)
    db.session.commit()
    post = Post.query.get_or_404(post_id)
    create_notification(uid, post.user_id, 'comment', post_id=post_id, comment_text=text)
    return {"status": "commented", "comment_id": c.id}
