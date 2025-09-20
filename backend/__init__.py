# backend/__init__.py
import os
from pathlib import Path
from flask import Flask, jsonify
from .config import get_config_class
from .extensions import db, migrate 

def create_app() -> Flask:
    app = Flask(__name__)

    config_name = os.getenv("FLASK_CONFIG", "development")
    app.config.from_object(get_config_class(config_name))

    upload_dir = Path(app.config.get("UPLOAD_FOLDER", "./backend/uploads"))
    upload_dir.mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)

    from .routes.wardrobe import wardrobe_bp
    from .routes.auth import auth_bp
    from .routes.wardrobe import wardrobe_bp
    from .routes.suggestions import suggestions_bp
    from .routes.drip import drip_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(wardrobe_bp, url_prefix="/api/wardrobe")
    app.register_blueprint(suggestions_bp, url_prefix="/api/suggestions")
    app.register_blueprint(drip_bp, url_prefix="/api/drip")

    @app.get("/api/health")
    def health() -> tuple[dict, int]:
        return {"status": "ok"}, 200

    @app.errorhandler(404)
    def not_found(_: Exception):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(err: Exception):
        return jsonify({"error": "Server error", "detail": str(err)}), 500

    return app