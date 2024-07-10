import React, { useState } from 'react';

const AddToListModal = ({ isOpen, onClose, onSubmit }) => {
  const [animeStatus, setAnimeStatus] = useState('Plan to Watch');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    onSubmit({ status: animeStatus });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-yellow-500">Add to My List</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <label htmlFor="animeStatus" className="block mb-2 text-sm font-medium text-gray-300">Status:</label>
        <select
          id="animeStatus"
          value={animeStatus}
          onChange={(e) => setAnimeStatus(e.target.value)}
          className="w-full p-2.5 bg-gray-700 text-gray-300 rounded-lg mb-4"
        >
          <option value="Watching">Watching</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Dropped">Dropped</option>
          <option value="Plan to Watch">Plan to Watch</option>
        </select>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add to My List
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;
