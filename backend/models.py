from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    """
    User table based on Supabase UUID as primary key.
    Contains both authentication info (if needed) and profile fields.
    """
    id = db.Column(db.String, primary_key=True)  # supabase auth user id (uuid)
    # Optional: if you also run local auth (fallback when supabase is off)
    email = db.Column(db.String(120), unique=True, nullable=True)  
    password_hash = db.Column(db.String(200), nullable=True)

    # Profile fields
    username = db.Column(db.String(80), unique=True, nullable=False)
    display_name = db.Column(db.String(100))
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(200))       # syncs with supabase picture
    profile_picture = db.Column(db.String(200))  # local uploads
    theme_preference = db.Column(db.String(20), default='light')
    is_premium = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    wardrobe_items = db.relationship('WardrobeItem', backref='owner', lazy=True)
    posts = db.relationship('Post', backref='author', lazy=True)

    # Utilities for optional password auth
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class WardrobeItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    image_path = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # top, bottom, shoes, accessories
    color = db.Column(db.String(50))
    style = db.Column(db.String(50))
    season = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)  # unified (url/path)
    caption = db.Column(db.Text)
    likes_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    likes = db.relationship('Like', backref='post', lazy=True)
    comments = db.relationship('Comment', backref='post', lazy=True)


class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    following_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Save(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)  # unified "text" instead of "content"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # like | comment | save | follow
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=True)
    comment_text = db.Column(db.String, nullable=True)
    message = db.Column(db.String(200), nullable=True)  # for flexibility
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)
