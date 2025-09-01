# backend/notifications.py
from flask import Blueprint, jsonify, request
from extensions import db
from models import Notification
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([{
        "id": n.id,
        "type": n.type,
        "message": n.message,
        "created_at": n.created_at.isoformat(),
        "is_read": n.is_read
    } for n in notifications])

@notifications_bp.route("/notifications/<int:notification_id>/read", methods=["PATCH"])
@jwt_required()
def mark_as_read(notification_id):
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first_or_404()
    notification.is_read = True
    db.session.commit()
    return jsonify({"success": True, "id": notification_id})
