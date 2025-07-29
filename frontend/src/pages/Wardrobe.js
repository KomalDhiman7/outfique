import { useEffect, useState } from "react";
import { getWardrobe } from "../api";



export default function Wardrobe() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    getWardrobe().then(setOutfits);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Wardrobe</h1>
      <div className="grid grid-cols-2 gap-4">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="border p-2">
            <img src={outfit.image_url} alt="outfit" className="w-full h-40 object-cover" />
            <div className="text-sm mt-2">
              <p><strong>Category:</strong> {outfit.category}</p>
              <p><strong>Color:</strong> {outfit.color}</p>
              <p><strong>Weather:</strong> {outfit.weather_type}</p>
              <p><strong>Mood:</strong> {outfit.mood}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

