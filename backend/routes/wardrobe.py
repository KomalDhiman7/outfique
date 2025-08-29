from flask import Blueprint, jsonify, request

wardrobe_bp = Blueprint('wardrobe', __name__, url_prefix='/api/wardrobe')

# Sample route just to test
@wardrobe_bp.route('/', methods=['GET'])
def get_wardrobe():
    return jsonify({"message": "Wardrobe route is working!"})
