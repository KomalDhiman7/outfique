<!-- backend/README.md -->
## Outfique Flask Backend

### Setup
1. cd backend
2. python3 -m venv .venv && source .venv/bin/activate
3. pip install -r requirements.txt
4. cp .env.example .env and fill Supabase values
5. export $(grep -v '^#' .env | xargs)

### Database
- Initialize migrations:
  - flask --app backend:create_app db init
  - flask --app backend:create_app db migrate -m "init"
  - flask --app backend:create_app db upgrade

### Run
- Development:
  - FLASK_APP=backend:create_app FLASK_CONFIG=development flask run --debug
- Production:
  - Use `backend/wsgi.py` with a WSGI server (e.g., gunicorn).

### API Overview
- GET /api/health
- Auth:
  - POST /api/auth/signup {email,password}
  - POST /api/auth/login {email,password}
  - POST /api/auth/logout (Bearer token)
  - GET /api/auth/me (Bearer token)
- Wardrobe (Bearer token):
  - POST /api/wardrobe/upload (multipart: file, category, color?, notes?)
  - GET /api/wardrobe/items
  - GET /api/wardrobe/items/:id
  - DELETE /api/wardrobe/items/:id
- Suggestions (Bearer token):
  - GET /api/suggestions/pairings?item_id=ID
  - POST /api/suggestions/recommend {weather:{temp_c,condition}, mood}
- Drip (Bearer token):
  - POST /api/drip/rate {item_ids:{top_id,bottom_id,shoes_id,outer_id?},weather?,mood?}