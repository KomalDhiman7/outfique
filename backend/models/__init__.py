# backend/models/__init__.py
from .user import User
from .outfit import Outfit
## Removed circular import. Import WardrobeItem directly from models.py where needed.
