const BASE_URL = "http://localhost:5000"; // or your backend URL

export const getWardrobe = async () => {
  const res = await fetch(`${BASE_URL}/wardrobe/all`);
  return res.json();
};

export const addOutfit = async (outfitData) => {
  const res = await fetch(`${BASE_URL}/wardrobe/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(outfitData),
  });
  return res.json();
};
