from flask import Blueprint, request, jsonify
from . import db
from .models import WardrobeItem
import os
from werkzeug.utils import secure_filename

bp = Blueprint('routes', __name__)

@bp.route('/upload-wardrobe', methods=['POST'])
def upload_wardrobe():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    caption = request.form.get('caption', '')
    if file.filename == '':
        return jsonify({'error': 'No filename'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join('app', 'static', 'uploads', filename)
    file.save(file_path)

    item = WardrobeItem(filename=filename, caption=caption)
    db.session.add(item)
    db.session.commit()

    return jsonify({
        'message': 'Image uploaded and saved to wardrobe!',
        'item': {
            'id': item.id,
            'filename': item.filename,
            'caption': item.caption
        }
    })

@bp.route('/wardrobe', methods=['GET'])
def get_wardrobe():
    items = WardrobeItem.query.all()
    return jsonify([
        {
            'id': item.id,
            'filename': item.filename,
            'caption': item.caption,
            'image_url': f'/static/uploads/{item.filename}'
        }
        for item in items
    ])
@bp.route('/wardrobe/<int:item_id>', methods=['DELETE'])
def delete_wardrobe_item(item_id):
    item = WardrobeItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

@bp.route('/')
def home():
    return jsonify({'message': 'Outfique API is slaying 💅'})
