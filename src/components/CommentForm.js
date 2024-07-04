import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CommentForm = ({ animeId, episodeNumber }) => {
  const { data: session } = useSession();
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(`/api/comments/${animeId}`, {
        text,
        episodeNumber,
      }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      setText('');
    } catch (error) {
        console.error(session.accessToken)
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Add a Comment</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-gray-700 text-gray-300 p-2 rounded mb-4"
          rows="4"
          placeholder="Remember to be respectful and follow our community guidelines."
        ></textarea>
        <button type="submit" className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600">
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
