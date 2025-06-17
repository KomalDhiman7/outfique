from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///outfique.db'
    app.config['UPLOAD_FOLDER'] = os.path.join('app', 'static', 'uploads')

    db.init_app(app)

    # Import and register blueprints AFTER initializing app/db
    from .routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    with app.app_context():
        from . import models  # so that models are registered
        db.create_all()

    return app
