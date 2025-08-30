from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

drip_bp = Blueprint("drip", __name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")  # absolute safe path
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@drip_bp.route("/api/drip", methods=["POST"])
def upload_drip():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # TODO: Replace with AI logic (e.g. OpenCV + ML)
        suggestion = {
            "rating": 4,
            "recommended_item": {
                "name": "White Cotton T-Shirt",
                "image": "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/34670653/2025/1/20/36ffddbf-0a3d-41c2-9146-9602b4ff0efb1737355108921-DressBerry-Women-Bio-Finish-Solid-Round-Neck-Cotton-Slim-Fit--1.jpg",
                "link": "https://www.myntra.com/tshirts/dressberry/dressberry-women-bio-finish-solid-round-neck-cotton-slim-fit-t-shirt/34670653/buy"
            }
        }

        return jsonify({"success": True, "suggestion": suggestion})

    return jsonify({"error": "Invalid file format"}), 400
