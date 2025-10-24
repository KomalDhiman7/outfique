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
export async function analyzeDrip(token, file) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API}/api/drip/analyze`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => 'Analysis failed');
      throw new Error(txt);
    }
    return res.json();
  } catch (err) {
    // Network or CORS error (Failed to fetch) — fallback to a local mock so UI stays usable.
    console.warn('analyzeDrip network error, returning mock suggestions:', err.message);
    // Mock: common pairings for a white t-shirt
    return {
      suggestions: [
        {
          id: 'mock-jeans-1',
          name: 'Light Blue High Waisted Jeans',
          image: 'https://images.unsplash.com/photo-1520975917545-8a6f0b8d7f2f',
          price: '$39.99',
          affiliateLink: 'https://www.amazon.com/s?k=light+blue+jeans'
        },
        {
          id: 'mock-shorts-1',
          name: 'Navy Chino Shorts',
          image: 'https://images.unsplash.com/photo-1520975917545-8a6f0b8d7f2f',
          price: '$24.99',
          affiliateLink: 'https://www.amazon.com/s?k=navy+shorts'
        },
        {
          id: 'mock-skirt-1',
          name: 'Blue Denim Skirt',
          image: 'https://images.unsplash.com/photo-1520975917545-8a6f0b8d7f2f',
          price: '$29.99',
          affiliateLink: 'https://www.amazon.com/s?k=denim+skirt'
        }
      ]
    };
  }
}

export async function rateDrip(token, file) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API}/api/drip/rate`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => 'Rating failed');
      throw new Error(txt);
    }
    return res.json();
  } catch (err) {
    console.warn('rateDrip network error, returning mock score:', err.message);
    // Fallback mock score
    return { score: Math.floor(7 + Math.random() * 3) }; // 7-9
  }
}
