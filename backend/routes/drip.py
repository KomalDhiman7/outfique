from flask import Blueprint, request, jsonify
import requests
import random

drip_bp = Blueprint("drip", __name__)

@drip_bp.route("/api/drip", methods=["POST"])
def drip():
    data = request.get_json()
    image_url = data.get("image_url")

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    # ✅ Download image for processing
    try:
        response = requests.get(image_url, stream=True)
        if response.status_code != 200:
            return jsonify({"error": "Could not download image"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to fetch image: {str(e)}"}), 500

    # TODO: add real OpenCV analysis here
    # For now, fake drip rating
    drip_rating = random.randint(2, 5)

    # Example recommendation
    suggestion = {
        "rating": drip_rating,
        "recommended_item": {
            "name": "Sky Blue Wide-Leg Jeans",
            "image": "https://assets.myntassets.com/fake-jeans.jpg",
            "link": "https://www.myntra.com/fake-jeans",
        },
    }

    return jsonify({"suggestion": suggestion})
