import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

const Comments = ({ animeId, episodeNumber }) => {
  const { data: comments, error } = useSWR(() => (animeId && episodeNumber !== null) ? `/api/comments?animeId=${animeId}&episodeNumber=${episodeNumber}` : null, fetcher);

  if (!comments && !error) return <div>Loading comments...</div>;
  if (error) return <div>Failed to load comments</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
      <h3 className="text-2xl font-bold text-yellow-500 mb-4">Comments</h3>
      <div className="bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto pr-4 border border-gray-700">
        {comments.length === 0 ? (
          <div>No comments yet.</div>
        ) : (
          <ul>
            {comments.map(comment => (
              <li key={comment._id} className="mb-4 p-4 border border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <img src={comment.user.image} alt={comment.user.name} className="w-10 h-10 rounded-full mr-2" />
                  <span className="font-semibold">{comment.user.name}</span>
                </div>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Comments;
