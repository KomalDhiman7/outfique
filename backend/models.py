# backend/models.py
from __future__ import annotations
from datetime import datetime
from .extensions import db

class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class User(db.Model, TimestampMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    supabase_user_id = db.Column(db.String(64), unique=True, index=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)

    wardrobe_items = db.relationship("WardrobeItem", backref="user", lazy=True)
    outfits = db.relationship("Outfit", backref="user", lazy=True)

class WardrobeItem(db.Model, TimestampMixin):
    __tablename__ = "wardrobe_items"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category = db.Column(db.String(64), nullable=False)  # shirt, pants, shoes, accessory, jacket, dress, skirt
    color = db.Column(db.String(64), nullable=True)
    image_path = db.Column(db.String(512), nullable=False)
    notes = db.Column(db.String(512), nullable=True)
    features = db.Column(db.JSON, nullable=True)  # dominant colors, etc.

class Outfit(db.Model, TimestampMixin):
    __tablename__ = "outfits"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(128), nullable=True)
    rating = db.Column(db.Integer, nullable=True)  # 0-100
    context = db.Column(db.String(128), nullable=True)

class OutfitItem(db.Model):
    __tablename__ = "outfit_items"
    id = db.Column(db.Integer, primary_key=True)
    outfit_id = db.Column(db.Integer, db.ForeignKey("outfits.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("wardrobe_items.id"), nullable=False)