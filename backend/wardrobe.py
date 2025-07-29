from flask import Blueprint, request, jsonify
from models.outfit import Outfit
from app import db


wardrobe_bp = Blueprint('wardrobe', __name__, url_prefix='/wardrobe')

@wardrobe_bp.route('/add', methods=['POST'])
def add_outfit():
    data = request.json
    new_outfit = Outfit(
        image_url=data['image_url'],
        category=data.get('category'),
        color=data.get('color'),
        weather_type=data.get('weather_type'),
        mood=data.get('mood')
    )
    db.session.add(new_outfit)
    db.session.commit()
    return jsonify({'message': 'Outfit added successfully'}), 201

@wardrobe_bp.route('/all', methods=['GET'])
def get_outfits():
    outfits = Outfit.query.all()
    return jsonify([{
        'id': o.id,
        'image_url': o.image_url,
        'category': o.category,
        'color': o.color,
        'weather_type': o.weather_type,
        'mood': o.mood
    } for o in outfits])
