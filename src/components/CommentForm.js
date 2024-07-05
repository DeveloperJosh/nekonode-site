import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CommentForm = ({ animeId, episodeNumber }) => {
  const { data: session } = useSession();
  const [text, setText] = useState('');
  const [moderationMessage, setModerationMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(`/api/comments?animeId=${animeId}&episodeNumber=${episodeNumber}`, {
        text,
      }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      setText('');
      setModerationMessage('Your comment is waiting for moderation to review it.');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Add a Comment</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-700 text-gray-300 p-2 rounded mb-4"
          rows="4"
          placeholder="Remember to be respectful and follow our community guidelines."
        ></textarea>
        <button type="submit" className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600">
          Post Comment
        </button>
        {moderationMessage && (
          <div className="mt-4">
            {moderationMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentForm;
