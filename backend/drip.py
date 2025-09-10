# backend/drip.py
from flask import Blueprint, request
from .auth import require_auth
from .models import WardrobeItem
from .utils.color import colors_harmonize

drip_bp = Blueprint("drip", __name__)

@drip_bp.post("/rate")
@require_auth
def rate_drip():
    data = request.get_json() or {}
    item_ids = data.get("item_ids") or {}
    weather = data.get("weather") or {}
    mood = (data.get("mood") or "").lower()

    top = WardrobeItem.query.filter_by(user_id=request.user.id, id=item_ids.get("top_id")).first() if item_ids.get("top_id") else None
    bottom = WardrobeItem.query.filter_by(user_id=request.user.id, id=item_ids.get("bottom_id")).first() if item_ids.get("bottom_id") else None
    shoes = WardrobeItem.query.filter_by(user_id=request.user.id, id=item_ids.get("shoes_id")).first() if item_ids.get("shoes_id") else None
    outer = WardrobeItem.query.filter_by(user_id=request.user.id, id=item_ids.get("outer_id")).first() if item_ids.get("outer_id") else None

    completeness = sum(1 for x in [top, bottom, shoes] if x)
    base_score = completeness / 3 * 60

    harmony_score = 20
    if top and bottom:
        tcol = (top.features or {}).get("dominant_colors") or []
        bcol = (bottom.features or {}).get("dominant_colors") or []
        if tcol and bcol:
            harmony_score = max(colors_harmonize(tuple(tcol[0]), tuple(bcol[0])), 20)
            harmony_score = min(100, harmony_score)
    base_score += (harmony_score * 0.3)

    temp = float((weather or {}).get("temp_c") or 22.0)
    weather_bonus = 0
    if temp < 15 and outer: weather_bonus += 10
    if temp > 28 and not outer: weather_bonus += 5
    base_score += weather_bonus

    mood_bonus = 0
    if mood in {"formal"} and outer: mood_bonus += 5
    if mood in {"party", "date"} and shoes: mood_bonus += 5
    base_score += mood_bonus

    score = int(max(0, min(100, base_score)))
    reasons = []
    if completeness < 3: reasons.append("Outfit incomplete")
    if weather_bonus > 0: reasons.append("Weather-appropriate")
    if mood_bonus > 0: reasons.append("Matches mood")

    return {"score": score, "reasons": reasons}, 200