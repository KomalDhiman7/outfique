import React from 'react';

type Props = {
  outfit: {
    id: number;
    name: string;
    category: string;
    color: string;
    image_url: string;
  };
  onDelete: (id: number) => void;
};

const OutfitCard: React.FC<Props> = ({ outfit, onDelete }) => (
  <div className="border p-4 rounded shadow bg-white">
    <img src={outfit.image_url} alt={outfit.name} className="w-full h-48 object-cover mb-2" />
    <h3 className="text-lg font-bold">{outfit.name}</h3>
    <p className="text-sm text-gray-600">{outfit.category} · {outfit.color}</p>
    <button
      className="mt-2 text-red-500 text-sm"
      onClick={() => onDelete(outfit.id)}
    >
      Delete
    </button>
  </div>
);

export default OutfitCard;
