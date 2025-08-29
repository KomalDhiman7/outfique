# backend/routes/drip.py
from flask import Blueprint, request, jsonify
import cv2
import numpy as np
from werkzeug.utils import secure_filename
import os

drip_bp = Blueprint('drip', __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@drip_bp.route('/api/drip', methods=['POST'])
def drip():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # OpenCV processing example
    image = cv2.imread(filepath)
    avg_color = image.mean(axis=0).mean(axis=0).tolist()

    # Fake drip score
    drip_score = int((np.mean(avg_color) / 255) * 100)

    # Sample suggestion with affiliate link
    suggestions = [
        {
            "item": "Blue Wide Leg Jeans",
            "image": "https://m.media-amazon.com/images/I/61f8Dq9v8HL._AC_UL320_.jpg",
            "link": "https://amzn.to/blue-jeans"
        },
        {
            "item": "White Crop Top",
            "image": "https://m.media-amazon.com/images/I/51F8gD3qTwL._AC_UL320_.jpg",
            "link": "https://amzn.to/white-top"
        }
    ]

    return jsonify({
        "drip_score": drip_score,
        "suggestions": suggestions
    })
