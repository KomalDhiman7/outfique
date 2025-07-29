from flask import Blueprint

suggestions_bp = Blueprint('suggestions', __name__)

@suggestions_bp.route('/suggestions')
def get_suggestions():
    return {"message": "Suggestions route is working!"}
