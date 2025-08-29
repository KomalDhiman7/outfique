from flask import Blueprint, request, jsonify

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/posts", methods=["GET"])
def get_posts():
    return jsonify({"message": "Posts API working"})
