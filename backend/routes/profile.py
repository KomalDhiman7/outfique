from flask import Blueprint, jsonify
from models import User, Post, Follow
from utils import current_user_id


profile_bp = Blueprint('profile', __name__)


@profile_bp.get('/<user_id>')
def get_profile(user_id):
current_user_id() # ensures auth present
user = User.query.get_or_404(user_id)
posts = Post.query.filter_by(user_id=user_id).order_by(Post.created_at.desc()).all()


followers = Follow.query.filter_by(following_id=user_id).count()
following = Follow.query.filter_by(follower_id=user_id).count()


return {
'user': {
'id': user.id,
'username': user.username,
'avatar_url': user.avatar_url,
'followers': followers,
'following': following,
},
'posts': [{
'id': p.id,
'image_url': p.image_url,
'caption': p.caption,
'created_at': p.created_at.isoformat(),
} for p in posts]
}