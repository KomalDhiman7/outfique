from flask import Flask
from flask_cors import CORS

from extensions import jwt
from routes.wardrobe import wardrobe_bp
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.posts import posts_bp
from routes.social import social_bp
from routes.notifications import notifications_bp
from routes.drip import drip_bp

def create_app():
    app = Flask(__name__)

    # JWT setup
    jwt.init_app(app)

    # Enable CORS for frontend
    CORS(app, resources={r"/*": {"origins": "*"}})


    # Register all blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(wardrobe_bp, url_prefix="/api/wardrobe")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(social_bp, url_prefix="/api/social")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(drip_bp, url_prefix="/api/drip")

    return app
