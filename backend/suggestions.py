from flask import Blueprint, jsonify

suggestions_bp = Blueprint('suggestions', __name__)

@suggestions_bp.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    return jsonify({
        "suggestions": [
            "White T-shirt + Blue Jeans",
            "Summer Dress + Sandals",
            "Tank Top + Shorts"
        ]
    })
