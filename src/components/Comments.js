import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ animeId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${animeId}`);
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [animeId]);

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-yellow-500 mb-4">Comments</h2>
     <div className="mt-8 p-4 bg-gray-800 rounded-lg">
       <div className="max-h-96 pr-2 overflow-y-auto space-y-4 rounded-lg">
         {comments.length > 0 ? (
           comments.map((comment) => (
             <div key={comment._id} className="bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-4 w-full">
               <img src={comment.user.image} alt={comment.user.name} className="w-10 h-10 rounded-full" />
               <div className="flex-1">
                 <p className="text-yellow-500 font-bold">{comment.user.name}</p>
                 <p className="text-gray-300">{comment.text}</p>
                 <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
               </div>
             </div>
          ))
        ) : (
          <p className="text-gray-300">No comments available.</p>
        )}
       </div>
     </div>
    </div>
  );
};

export default Comments;