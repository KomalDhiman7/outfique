from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..utils.clothing_analysis import analyze_clothing
import random

drip_bp = Blueprint('drip', __name__)

# Affiliate product database (mock - replace with real database)
AFFILIATE_PRODUCTS = {
    'blue': [
        {
            'name': 'Classic White T-Shirt',
            'image': 'https://m.media-amazon.com/images/I/71D4QmQYrDL._AC_UY879_.jpg',
            'price': '$19.99',
            'link': 'https://www.amazon.com/dp/B07Y8GL6M4'
        },
        {
            'name': 'Khaki Chinos',
            'image': 'https://m.media-amazon.com/images/I/71pL8wv+qmL._AC_UY879_.jpg',
            'price': '$39.99',
            'link': 'https://www.amazon.com/dp/B07Y8GL6M4'
        }
    ],
    'white': [
        {
            'name': 'Blue Slim Fit Jeans',
            'image': 'https://m.media-amazon.com/images/I/71azu3LVxvL._AC_UY879_.jpg',
            'price': '$49.99',
            'link': 'https://www.amazon.com/dp/B07Y8GL6M4'
        },
        {
            'name': 'Navy Chino Shorts',
            'image': 'https://m.media-amazon.com/images/I/71pL8wv+qmL._AC_UY879_.jpg',
            'price': '$29.99',
            'link': 'https://www.amazon.com/dp/B07Y8GL6M4'
        }
    ]
}

@drip_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Analyze the image using OpenCV
        analysis = analyze_clothing(file.read())
        
        # Get product suggestions based on color
        suggestions = AFFILIATE_PRODUCTS.get(
            analysis['color_category'], 
            AFFILIATE_PRODUCTS['white']  # fallback to white if color not found
        )
        
        return jsonify({
            'analysis': analysis,
            'suggestions': suggestions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@drip_bp.route('/rate', methods=['POST'])
@jwt_required()
def rate_drip():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Analyze the image
        analysis = analyze_clothing(file.read())
        
        # Calculate drip score based on color harmony
        # This is a simple scoring system - enhance based on your criteria
        base_score = 7  # Start with a base score
        
        # Add points for color harmony
        if analysis['color_category'] in ['white', 'black', 'navy']:  # versatile colors
            base_score += 2
        
        # Add some randomness (±1)
        final_score = min(10, max(1, base_score + random.randint(-1, 1)))
        
        # Get a suggested item
        suggestions = AFFILIATE_PRODUCTS.get(
            analysis['color_category'], 
            AFFILIATE_PRODUCTS['white']
        )
        recommended_item = random.choice(suggestions) if suggestions else None
        
        return jsonify({
            'score': final_score,
            'color_analysis': analysis,
            'recommended_item': recommended_item
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
