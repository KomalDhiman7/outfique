from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['JWT_SECRET_KEY'] = 'your-jwt-secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

    db.init_app(app)
    JWTManager(app)
    CORS(app)

    # Import and register blueprints
    from auth import auth_bp
    from suggestions import suggestions_bp
    from routes.wardrobe import wardrobe_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(suggestions_bp)
    app.register_blueprint(wardrobe_bp)

    with app.app_context():
        from models.outfit import Outfit  # Ensure model is loaded
        db.create_all()

    return app

app = create_app()
