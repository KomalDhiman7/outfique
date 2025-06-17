from . import db

class WardrobeItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    caption = db.Column(db.String(200))
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())
