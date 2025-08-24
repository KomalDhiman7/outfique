// src/pages/Wardrobe.js
import React, { useEffect, useState } from 'react';
import OutfitCard from '../components/OutfitCard';
import { supabase, wardrobeHelpers } from '../supabase';

const Wardrobe = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  // Get the current user id from Supabase session
  const getUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user?.id || null;
  };

  const fetchWardrobe = async () => {
    try {
      setError('');
      setLoading(true);
      const userId = await getUserId();
      if (!userId) {
        setError('No authenticated user found.');
        setWardrobe([]);
        return;
      }
      const { data, error } = await wardrobeHelpers.getWardrobeItems(userId);
      if (error) {
        setError(error.message || 'Failed to fetch wardrobe.');
        return;
      }
      setWardrobe(data || []);
    } catch (e) {
      setError(e.message || 'Unexpected error while fetching wardrobe.');
    } finally {
      setLoading(false);
    }
  };

  // Demo add outfit: uploads a placeholder Blob to Supabase Storage and creates a DB row
  const handleAddOutfit = async () => {
    try {
      setAdding(true);
      setError('');
      const userId = await getUserId();
      if (!userId) {
        setError('No authenticated user found.');
        return;
      }

      // Create a tiny placeholder file (in real app, use a file input)
      const blob = new Blob(['demo'], { type: 'text/plain' });
      const fakeFile = new File([blob], 'placeholder.txt', { type: 'text/plain' });

      const { error: uploadErr, data } = await wardrobeHelpers.uploadClothingItem(fakeFile, userId);
      if (uploadErr) {
        setError(uploadErr.message || 'Failed to upload item.');
        return;
      }

      await fetchWardrobe();
    } catch (e) {
      setError(e.message || 'Unexpected error while adding outfit.');
    } finally {
      setAdding(false);
    }
  };

  // Optional: implement deletion if you have an API/table for it
  const handleDelete = async (id) => {
    try {
      setError('');
      // Example if you later add a delete API:
      // const { error } = await supabase.from('wardrobe_items').delete().eq('id', id);
      // if (error) throw error;
      console.warn('Delete not implemented yet. Row id:', id);
      // After real delete, refresh:
      // await fetchWardrobe();
    } catch (e) {
      setError(e.message || 'Failed to delete item.');
    }
  };

  useEffect(() => {
    fetchWardrobe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👚 My Wardrobe</h1>

      <div className="flex items-center gap-3 mb-4">
        <button
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={handleAddOutfit}
          disabled={adding}
        >
          {adding ? 'Adding…' : '➕ Add Outfit'}
        </button>

        <button
          className="border border-gray-300 px-4 py-2 rounded"
          onClick={fetchWardrobe}
          disabled={loading}
          title="Refresh wardrobe"
        >
          ⟳ Refresh
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-3">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading wardrobe…</div>
      ) : wardrobe.length === 0 ? (
        <div className="text-gray-600">No items yet. Add your first outfit.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wardrobe.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wardrobe;
