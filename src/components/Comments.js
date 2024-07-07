import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Image from 'next/image';

const fetcher = url => axios.get(url).then(res => res.data);

const Comments = ({ animeId, episodeNumber }) => {
  const { data: comments, error } = useSWR(() => (animeId && episodeNumber !== null) ? `/api/comments?animeId=${animeId}&episodeNumber=${episodeNumber}` : null, fetcher);

  if (!comments && !error) return <div>Loading comments...</div>;
  if (error) return <div>Failed to load comments</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
      <h3 className="text-2xl font-bold text-yellow-500 mb-4">Comments</h3>
      <div className="bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto pr-4 border border-gray-800">
        {comments.length === 0 ? (
          <div className="text-gray-300">No comments yet.</div>
        ) : (
          <ul>
            {comments.map(comment => (
              <li key={comment._id} className="mb-4 p-4 border border-gray-600 bg-gray-600 rounded-lg">
                <div className="flex items-center mb-2">
                  <Image 
                    src={comment.user.image} 
                    alt={comment.user.name} 
                    width={40} 
                    height={40} 
                    className="w-10 h-10 rounded-full mr-2" 
                  />
                  <span className="font-semibold text-yellow-500">{comment.user.name}</span>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Comments;
