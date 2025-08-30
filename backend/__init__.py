from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

from backend.config import Config
from backend.app_extensions import db

# Blueprints
from backend.routes.posts import posts_bp
from backend.routes.social import social_bp
from backend.routes.notifications import notifications_bp
from backend.routes.profile import profile_bp
from backend.routes.auth import auth_bp
from backend.routes.user import user_bp
from backend.routes.wardrobe import wardrobe_bp
from backend.routes.suggestions import suggestions_bp
from backend.routes.drip import drip_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow credentials for frontend-backend sessions
    CORS(app, supports_credentials=True)

    # Initialize extensions
    db.init_app(app)
    JWTManager(app)

    # Ensure upload folder exists
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(wardrobe_bp, url_prefix='/api/wardrobe')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(suggestions_bp, url_prefix='/api/suggestions')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(social_bp, url_prefix='/api/social')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(drip_bp, url_prefix='/api/drip')  # ✅ important: url_prefix added

    # Simple health check
    @app.route('/')
    def index():
        return {"status": "ok"}

    # Create tables (if not using migrations yet)
    with app.app_context():
        db.create_all()

    return app
