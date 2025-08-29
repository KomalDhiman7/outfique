from flask import Blueprint, request
from sqlalchemy import desc
from models import Notification, User, Post
from utils import current_user_id


notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.get('/')
def list_notifications():
uid = current_user_id()
items = (Notification.query
.filter_by(receiver_id=uid)
.order_by(desc(Notification.created_at))
.limit(100)
.all())
# Join minimal sender + post info
def serialize(n):
sender = User.query.get(n.sender_id)
post = Post.query.get(n.post_id) if n.post_id else None
return {
'id': n.id,
'type': n.type,
'created_at': n.created_at.isoformat(),
'read': n.read,
'sender': {
'id': sender.id if sender else None,
'username': sender.username if sender else 'Unknown',
'avatar_url': sender.avatar_url if sender else None,
},
'post': {
'id': post.id,
'image_url': post.image_url,
} if post else None,
'comment_text': n.comment_text
}
return {'notifications': [serialize(n) for n in items]}


@notifications_bp.post('/mark-read')
def mark_read():
uid = current_user_id()
data = request.get_json() or {}
ids = data.get('ids', [])
if ids:
Notification.query.filter(Notification.receiver_id==uid, Notification.id.in_(ids)).update({Notification.read: True}, synchronize_session=False)
else:
Notification.query.filter_by(receiver_id=uid).update({Notification.read: True})
from extensions import db
db.session.commit()
return {"status": "ok"}