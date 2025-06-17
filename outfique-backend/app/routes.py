from flask import Blueprint, request, jsonify
from . import db
import os
from werkzeug.utils import secure_filename
from .models import WardrobeItem

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
    file_path = os.path.join('app/static/uploads', filename)

    # Make sure folder exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    file.save(file_path)

    # Save to DB
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
