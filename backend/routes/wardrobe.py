from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import cloudinary.uploader

wardrobe_bp = Blueprint("wardrobe", __name__)

@wardrobe_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_item():
    user_id = get_jwt_identity()
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        # Upload file to Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        image_url = upload_result["secure_url"]

        # Save image_url + user_id + metadata into DB
        from models import WardrobeItem
        from extensions import db
        category = request.form.get("category")
        color = request.form.get("color")
        notes = request.form.get("notes")
        item = WardrobeItem(
            user_id=user_id,
            category=category or "other",
            color=color,
            image_path=image_url,
            notes=notes
        )
        db.session.add(item)
        db.session.commit()

        return jsonify({
            "message": "Uploaded successfully ✅",
            "image_url": image_url,
            "item_id": item.id
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
