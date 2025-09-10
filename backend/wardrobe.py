# backend/wardrobe.py
import os
import uuid
from pathlib import Path
from flask import Blueprint, current_app, request, jsonify
from werkzeug.utils import secure_filename
from .extensions import db
from .models import WardrobeItem
from .database import save_instance, commit_session
from .auth import require_auth
from .utils.image import extract_dominant_colors

wardrobe_bp = Blueprint("wardrobe", __name__)

def _allowed(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in current_app.config["ALLOWED_EXTENSIONS"]

@wardrobe_bp.post("/upload")
@require_auth
def upload_item():
    if "file" not in request.files:
        return {"error": "file required"}, 400
    file = request.files["file"]
    if file.filename == "":
        return {"error": "empty filename"}, 400
    if not _allowed(file.filename):
        return {"error": "unsupported file type"}, 400

    category = request.form.get("category") or "unknown"
    color = request.form.get("color")
    notes = request.form.get("notes")

    filename = secure_filename(file.filename)
    ext = filename.rsplit(".", 1)[-1].lower()
    new_name = f"{uuid.uuid4().hex}.{ext}"
    upload_dir = Path(current_app.config["UPLOAD_FOLDER"])
    path = upload_dir / new_name
    file.save(path)

    try:
        dominant = extract_dominant_colors(str(path), k=3)
    except Exception:
        dominant = []

    item = WardrobeItem(
        user_id=request.user.id,
        category=category,
        color=color,
        image_path=str(path),
        notes=notes,
        features={"dominant_colors": dominant},
    )
    save_instance(item)
    return {"id": item.id, "message": "uploaded"}, 201

@wardrobe_bp.get("/items")
@require_auth
def list_items():
    items = WardrobeItem.query.filter_by(user_id=request.user.id).order_by(WardrobeItem.created_at.desc()).all()
    return {
        "items": [
            {
                "id": i.id,
                "category": i.category,
                "color": i.color,
                "image_path": i.image_path,
                "notes": i.notes,
                "features": i.features,
                "created_at": i.created_at.isoformat(),
            }
            for i in items
        ]
    }, 200

@wardrobe_bp.get("/items/<int:item_id>")
@require_auth
def get_item(item_id: int):
    i = WardrobeItem.query.filter_by(user_id=request.user.id, id=item_id).first()
    if not i:
        return {"error": "not found"}, 404
    return {
        "id": i.id,
        "category": i.category,
        "color": i.color,
        "image_path": i.image_path,
        "notes": i.notes,
        "features": i.features,
    }, 200

@wardrobe_bp.delete("/items/<int:item_id>")
@require_auth
def delete_item(item_id: int):
    i = WardrobeItem.query.filter_by(user_id=request.user.id, id=item_id).first()
    if not i:
        return {"error": "not found"}, 404
    try:
        db.session.delete(i)
        commit_session()
    finally:
        try:
            if i.image_path and os.path.exists(i.image_path):
                os.remove(i.image_path)
        except Exception:
            pass
    return {"message": "deleted"}, 200