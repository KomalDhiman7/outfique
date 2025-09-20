from flask import Blueprint, request, jsonify
drip_bp = Blueprint('drip', __name__)
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

drip_bp = Blueprint('drip', __name__)

@drip_bp.route('/rate', methods=['POST'])
@jwt_required()
def rate_drip():
    data = request.get_json()
    user_id = get_jwt_identity()

    item_ids = data.get("item_ids", [])
    weather = data.get("weather")
    mood = data.get("mood")

    # Dummy logic: just return a random rating and a suggestion
    import random
    rating = random.randint(2, 5)
    suggestion = {
        "name": "Sky Blue Wide-Leg Jeans",
        "image": "https://assets.myntassets.com/fake-jeans.jpg",
        "link": "https://www.myntra.com/fake-jeans",
    }

    return jsonify({
        "rating": rating,
        "recommended_item": suggestion
    })
