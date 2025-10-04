// src/api.js

// Detect backend URL depending on environment
const API =
  process.env.REACT_APP_API_BASE_URL || // CRA
  (typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_BASE_URL : null) || // Vite
  "https://refactored-goldfish-wrrpr9r4xg4ph9p54-5000.app.github.dev";

// ---------- Auth ----------
export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// ---------- Wardrobe ----------
export const getWardrobe = async (token) => {
  const res = await fetch(`${API}/api/wardrobe/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wardrobe");
  return res.json();
};


// ---------- Upload Cloth (via Cloudinary backend) ----------
export async function uploadCloth(token, file, { category, color, notes }) {
  const form = new FormData();
  form.append("file", file);
  if (category) form.append("category", category);
  if (color) form.append("color", color);
  if (notes) form.append("notes", notes);

  const res = await fetch(`${API}/api/wardrobe/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}


// Add an outfit to wardrobe (returns the new item with ID)
export const addOutfit = async (token, outfitData) => {
  const res = await fetch(`${API}/api/wardrobe/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(outfitData),
  });
  if (!res.ok) throw new Error("Failed to add outfit");
  return res.json(); // should include { id, image_url, category, ... }
};

// ---------- Suggestions ----------
export async function getPairings(token, itemId) {
  const res = await fetch(`${API}/api/suggestions/pairings?item_id=${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Pairings failed");
  return res.json();
}

// ---------- Drip ----------
export async function rateDrip(token, itemIds, weather, mood) {
  const res = await fetch(`${API}/api/drip/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item_ids: itemIds, weather, mood }),
  });
  if (!res.ok) throw new Error("Rate failed");
  return res.json();
}
