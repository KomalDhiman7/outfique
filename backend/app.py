from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from extensions import db

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['JWT_SECRET_KEY'] = 'your-jwt-secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    JWTManager(app)

    # ✅ CORS configured ONCE — use your frontend's origin
    CORS(app, origins=['https://<your-codespace-name>-3000.app.github.dev'], supports_credentials=True)

    # ✅ Register blueprints
    from auth import auth_bp
    from suggestions import suggestions_bp
    from wardrobe import wardrobe_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(suggestions_bp)
    app.register_blueprint(wardrobe_bp)

    with app.app_context():
        from models import Outfit
        db.create_all()

    return app

app = create_app()
