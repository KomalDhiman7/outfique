from flask import request, abort
from models import User
from extensions import db


# Extract current user from header (temporary, replace with Supabase JWT verification if needed)
def current_user_id():
uid = request.headers.get('X-User-Id')
if not uid:
abort(401, description='Missing X-User-Id header')
# ensure a user record exists (mirror from Supabase)
username = request.headers.get('X-Username', None)
avatar = request.headers.get('X-Avatar', None)
user = User.query.get(uid)
if not user and username:
user = User(id=uid, username=username, avatar_url=avatar)
db.session.add(user)
db.session.commit()
return uid


def create_notification(sender_id, receiver_id, ntype, post_id=None, comment_text=None):
from models import Notification
n = Notification(
sender_id=sender_id,
receiver_id=receiver_id,
type=ntype,
post_id=post_id,
comment_text=comment_text,
)
db.session.add(n)
db.session.commit()
return n