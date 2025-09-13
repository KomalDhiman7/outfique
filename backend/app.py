from flask import Flask
from flask_cors import CORS
from extensions import jwt  # if you set up jwt here
from routes.wardrobe import wardrobe_bp

def create_app():
    app = Flask(__name__)

    # JWT setup
    jwt.init_app(app)

    # Enable CORS for frontend
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register wardrobe route
    app.register_blueprint(wardrobe_bp, url_prefix="/api/wardrobe")

    return app
