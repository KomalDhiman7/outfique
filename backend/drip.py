# backend/drip.py
from flask import Blueprint, request
from .auth import require_auth
from .models import WardrobeItem
from .utils.color import colors_harmonize

drip_bp = Blueprint("drip", __name__)

@drip_bp.route("/rate", methods=["POST"])
@jwt_required()
def rate_drip():
    user_id = get_jwt_identity()
    data = request.get_json()

    item_ids = data.get("item_ids", [])
    weather = data.get("weather")
    mood = data.get("mood")

    # Fetch wardrobe items from DB
    items = WardrobeItem.query.filter(
        WardrobeItem.id.in_(item_ids),
        WardrobeItem.user_id == user_id
    ).all()

    if not items:
        return jsonify({"error": "No valid wardrobe items found"}), 400

    # Dummy scoring logic (replace with your ML/AI later)
    score = 4  # example
    recommended_item = {
        "name": "Sky Blue Jeans",
        "image": "https://via.placeholder.com/150",
        "link": "https://www.myntra.com",
    }

    return jsonify({
        "rating": score,
        "recommended_item": recommended_item
    })
