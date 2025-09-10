# backend/suggestions.py
from typing import List, Dict
from flask import Blueprint, request, jsonify
from .auth import require_auth
from .models import WardrobeItem
from .utils.color import colors_harmonize
from .utils.affiliates import generate_affiliate_links

suggestions_bp = Blueprint("suggestions", __name__)

CATEGORY_GROUPS = {
    "top": {"shirt", "tshirt", "top", "sweater", "hoodie"},
    "bottom": {"pants", "jeans", "trousers", "shorts", "skirt"},
    "outer": {"jacket", "coat", "blazer"},
    "shoes": {"shoes", "sneakers", "boots", "heels"},
    "accessory": {"accessory", "bag", "watch", "belt"},
}

def normalize_category(cat: str) -> str:
    c = (cat or "").lower()
    for k, v in CATEGORY_GROUPS.items():
        if c in v:
            return k
    return "top" if "shirt" in c else c or "top"

def filter_items_by_group(items: List[WardrobeItem], group: str) -> List[WardrobeItem]:
    return [i for i in items if normalize_category(i.category) == group]

@suggestions_bp.get("/pairings")
@require_auth
def pairings():
    item_id = request.args.get("item_id", type=int)
    if not item_id:
        return {"error": "item_id required"}, 400
    base = WardrobeItem.query.filter_by(user_id=request.user.id, id=item_id).first()
    if not base:
        return {"error": "not found"}, 404

    all_items = WardrobeItem.query.filter_by(user_id=request.user.id).all()
    base_group = normalize_category(base.category)

    needed = []
    if base_group == "top":
        needed = ["bottom", "shoes"]
    elif base_group == "bottom":
        needed = ["top", "shoes"]
    elif base_group == "outer":
        needed = ["top", "bottom", "shoes"]
    elif base_group == "shoes":
        needed = ["top", "bottom"]
    else:
        needed = ["top", "bottom", "shoes"]

    results = []
    for group in needed:
        candidates = filter_items_by_group(all_items, group)
        def score(candidate: WardrobeItem):
            base_colors = (base.features or {}).get("dominant_colors") or []
            cand_colors = (candidate.features or {}).get("dominant_colors") or []
            if not base_colors or not cand_colors:
                return 50
            scores = [colors_harmonize(tuple(bc), tuple(cc)) for bc in base_colors[:1] for cc in cand_colors[:1]]
            return max(scores) if scores else 50
        candidates = sorted(candidates, key=score, reverse=True)
        top3 = candidates[:3]
        if not top3:
            links = generate_affiliate_links(group, base.color)
            results.append({"group": group, "from_wardrobe": [], "affiliate_links": links})
        else:
            results.append({
                "group": group,
                "from_wardrobe": [
                    {
                        "id": c.id,
                        "category": c.category,
                        "color": c.color,
                        "image_path": c.image_path,
                        "score": score(c),
                    } for c in top3
                ],
                "affiliate_links": generate_affiliate_links(group, base.color),
            })
    return {"base_item_id": base.id, "pairings": results}, 200

@suggestions_bp.post("/recommend")
@require_auth
def recommend():
    payload = request.get_json() or {}
    weather = payload.get("weather", {})  # {temp_c, condition}
    mood = (payload.get("mood") or "").lower()
    temp = float(weather.get("temp_c") or 22.0)

    items = WardrobeItem.query.filter_by(user_id=request.user.id).all()
    tops = [i for i in items if normalize_category(i.category) == "top"]
    bottoms = [i for i in items if normalize_category(i.category) == "bottom"]
    outers = [i for i in items if normalize_category(i.category) == "outer"]
    shoes = [i for i in items if normalize_category(i.category) == "shoes"]

    recs: List[Dict] = []
    if temp < 15 and outers:
        pick_outer = outers[0]
        pick_top = tops[0] if tops else None
        pick_bottom = bottoms[0] if bottoms else None
        pick_shoes = shoes[0] if shoes else None
    elif temp > 28:
        pick_outer = None
        pick_top = tops[0] if tops else None
        pick_bottom = next((b for b in bottoms if "short" in b.category.lower()), (bottoms[0] if bottoms else None))
        pick_shoes = shoes[0] if shoes else None
    else:
        pick_outer = None
        pick_top = tops[0] if tops else None
        pick_bottom = bottoms[0] if bottoms else None
        pick_shoes = shoes[0] if shoes else None

    outfit = [x for x in [pick_outer, pick_top, pick_bottom, pick_shoes] if x]
    missing = []
    if not pick_top: missing.append("top")
    if not pick_bottom: missing.append("bottom")
    if not pick_shoes: missing.append("shoes")
    if temp < 15 and not pick_outer: missing.append("outer")

    rec = {
        "outfit_items": [
            {"id": x.id, "category": x.category, "color": x.color, "image_path": x.image_path} for x in outfit
        ],
        "missing": missing,
        "affiliate_links": {m: generate_affiliate_links(m, None) for m in missing},
        "mood": mood,
        "weather": weather,
    }
    recs.append(rec)
    return {"recommendations": recs}, 200