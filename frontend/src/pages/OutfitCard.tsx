import React, { useEffect, useState } from 'react';
import { getWardrobe, addOutfit, deleteOutfit } from '../api/wardrobe';
import OutfitCard from '../components/OutfitCard';

const Wardrobe = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const user_id = 'demo-user'; // Replace with Supabase user ID later

  const fetchWardrobe = async () => {
    const data = await getWardrobe(user_id);
    setWardrobe(data);
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const handleAddOutfit = async () => {
    await addOutfit({
      user_id,
      name: 'White T-shirt',
      category: 'Top',
      color: 'White',
      image_url: '/images/white-tshirt.jpg'
    });
    fetchWardrobe();
  };

  const handleDelete = async (id: number) => {
    await deleteOutfit(id);
    fetchWardrobe();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👚 My Wardrobe</h1>
      <button className="bg-black text-white px-4 py-2 rounded mb-4" onClick={handleAddOutfit}>
        ➕ Add Outfit
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wardrobe.map((outfit: any) => (
          <OutfitCard key={outfit.id} outfit={outfit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
