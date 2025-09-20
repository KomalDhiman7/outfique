from ..extensions import db

class Outfit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50))
    color = db.Column(db.String(50))
    weather_type = db.Column(db.String(50))
    mood = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
