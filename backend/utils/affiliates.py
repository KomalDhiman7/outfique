# backend/utils/affiliates.py
from urllib.parse import quote_plus

def generate_affiliate_links(category: str, color: str | None) -> dict:
    q = f"{color + ' ' if color else ''}{category}".strip()
    q = quote_plus(q)
    return {
        "amazon": f"https://www.amazon.in/s?k={q}",
        "myntra": f"https://www.myntra.com/{q}",
        "flipkart": f"https://www.flipkart.com/search?q={q}",
    }