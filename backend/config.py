# backend/config.py
import os
from pathlib import Path

class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{Path(os.getenv('SQLITE_PATH', './backend/outfique.db')).resolve()}",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "./backend/uploads")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]

    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_PROJECT_REF = os.getenv("SUPABASE_PROJECT_REF", "")
    SUPABASE_JWT_AUD = os.getenv("SUPABASE_JWT_AUD", "authenticated")

class DevelopmentConfig(BaseConfig):
    DEBUG = True

class ProductionConfig(BaseConfig):
    DEBUG = False

def get_config_class(name: str):
    name = (name or "").lower()
    if name.startswith("prod"):
        return ProductionConfig
    return DevelopmentConfig