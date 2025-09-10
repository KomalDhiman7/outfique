# backend/auth.py
import time
import requests
from functools import wraps
from flask import Blueprint, current_app, request, jsonify
from jose import jwt
from supabase import create_client
from .extensions import db
from .models import User
from .database import save_instance

auth_bp = Blueprint("auth", __name__)

def supabase_client():
    url = current_app.config["SUPABASE_URL"]
    key = current_app.config["SUPABASE_SERVICE_KEY"] or current_app.config["SUPABASE_ANON_KEY"]
    if not url or not key:
        raise RuntimeError("Supabase env is not configured")
    return create_client(url, key)

_JWKS_CACHE = {"keys": None, "exp": 0}

def _get_supabase_jwks():
    now = int(time.time())
    if _JWKS_CACHE["keys"] and _JWKS_CACHE["exp"] > now:
        return _JWKS_CACHE["keys"]
    project_ref = current_app.config["SUPABASE_PROJECT_REF"]
    if not project_ref:
        raise RuntimeError("SUPABASE_PROJECT_REF missing")
    url = f"https://{project_ref}.supabase.co/auth/v1/keys"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    jwks = resp.json()
    _JWKS_CACHE["keys"] = jwks
    _JWKS_CACHE["exp"] = now + 60 * 15
    return jwks

def _verify_jwt(token: str):
    jwks = _get_supabase_jwks()
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
    if not key:
        raise ValueError("Invalid token key id")
    project_ref = current_app.config["SUPABASE_PROJECT_REF"]
    issuer = f"https://{project_ref}.supabase.co/auth/v1"
    audience = current_app.config["SUPABASE_JWT_AUD"]
    return jwt.decode(token, key, algorithms=[key["alg"]], audience=audience, issuer=issuer)

def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing bearer token"}), 401
        token = auth_header.split(" ", 1)[1].strip()
        try:
            claims = _verify_jwt(token)
        except Exception as e:
            return jsonify({"error": "Invalid token", "detail": str(e)}), 401
        request.user_claims = claims
        supabase_user_id = claims.get("sub")
        email = claims.get("email") or claims.get("user_metadata", {}).get("email")
        if not supabase_user_id:
            return jsonify({"error": "Token missing subject"}), 401
        user = User.query.filter_by(supabase_user_id=supabase_user_id).first()
        if not user:
            user = save_instance(User(supabase_user_id=supabase_user_id, email=email or ""))
        request.user = user
        return fn(*args, **kwargs)
    return wrapper

@auth_bp.post("/signup")
def signup():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return {"error": "email and password required"}, 400
    client = supabase_client()
    res = client.auth.sign_up({"email": email, "password": password})
    user_id = (res.user and res.user.id) or None
    if not user_id:
        return {"error": "Signup failed"}, 400
    existing = User.query.filter((User.email == email) | (User.supabase_user_id == user_id)).first()
    if not existing:
        save_instance(User(supabase_user_id=user_id, email=email))
    return {"message": "Signup successful", "user_id": user_id}, 201

@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return {"error": "email and password required"}, 400
    client = supabase_client()
    res = client.auth.sign_in_with_password({"email": email, "password": password})
    session = res.session
    if not session:
        return {"error": "Login failed"}, 401
    user = res.user
    user_id = user.id if user else None
    if user_id:
        db_user = User.query.filter_by(supabase_user_id=user_id).first()
        if not db_user:
            save_instance(User(supabase_user_id=user_id, email=email))
    return {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "user": {"id": user_id, "email": email},
    }, 200

@auth_bp.post("/logout")
@require_auth
def logout():
    # Client should discard tokens; optional server-side revoke could be added via Supabase admin API.
    return {"message": "Logged out"}, 200

@auth_bp.get("/me")
@require_auth
def me():
    user = request.user
    return {"id": user.id, "supabase_user_id": user.supabase_user_id, "email": user.email}, 200