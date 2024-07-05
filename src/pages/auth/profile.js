import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import History from '@/components/History';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (session) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const historyResponse = await axios.get('/api/history');
          setHistory(historyResponse.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching history:', error);
          setError('Failed to fetch history');
        } finally {
          setLoadingHistory(false);
        }
      };

      fetchHistory();

      if (session.user.role === 'moderator' || session.user.role === 'admin') {
        const fetchComments = async () => {
          setLoadingComments(true);
          try {
            const commentsResponse = await axios.get('/api/mod/comments/pending');
            setComments(commentsResponse.data);
            setError(null);
          } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Failed to fetch comments');
          } finally {
            setLoadingComments(false);
          }
        };

        fetchComments();
      }
    }
  }, [session]);

  const handleApprove = async (commentId) => {
    try {
      await axios.post('/api/mod/comments/approve', { commentId });
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Failed to approve comment:', error);
    }
  };

  const handleReject = async (commentId) => {
    try {
      await axios.post('/api/mod/comments/reject', { commentId });
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Failed to reject comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p className="text-center text-red-500">Please log in to view your dashboard.</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-6 text-center">Your Dashboard</h2>

        <div className="mb-6 flex justify-around">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-4 ${activeTab === 'profile' ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-4 ${activeTab === 'history' ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            Anime List
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-4 ${activeTab === 'settings' ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            Settings
          </button>
          {(session.user.role === 'moderator' || session.user.role === 'admin') && (
            <button
              onClick={() => setActiveTab('moderation')}
              className={`py-2 px-4 ${activeTab === 'moderation' ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              Moderation
            </button>
          )}
        </div>

        {activeTab === 'profile' && (
          <div className="text-center">
            <img src={session.user.image} alt={session.user.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
            <p className="text-xl sm:text-2xl">Name: <span className="font-bold">{session.user.name}</span></p>
            <p className="text-xl sm:text-2xl">Email: <span className="font-bold">{session.user.email}</span></p>
            <p className="text-xl sm:text-2xl">ID: <span className="font-bold">{session.user.id}</span></p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 gap-4">
            {loadingHistory ? (
              <p className="text-xl sm:text-2xl text-center">Loading history...</p>
            ) : error ? (
              <p className="text-xl sm:text-2xl text-center text-red-500">{error}</p>
            ) : history.length === 0 ? (
              <p className="text-xl sm:text-2xl text-center">No history available.</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-lg font-bold">Anime: {item.animeId}</p>
                  <p>Episode: {item.episodeNumber}</p>
                  <p>
                    <Link className="text-blue-500 hover:text-blue-700" href={`/anime/${item.animeId}`}>
                      Watch Anime
                    </Link>
                  </p>
                  <p>Watched: {formatDate(item.watchedAt)}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center">
            <p className="text-xl sm:text-2xl">User settings panel here</p>
          </div>
        )}

        {activeTab === 'moderation' && (session.user.role === 'moderator' || session.user.role === 'admin') && (
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-4"> {/* Added padding-right */}
            {loadingComments ? (
              <p className="text-xl sm:text-2xl text-center">Loading comments...</p>
            ) : error ? (
              <p className="text-xl sm:text-2xl text-center text-red-500">{error}</p>
            ) : comments.length === 0 ? (
              <p className="text-xl sm:text-2xl text-center">No pending comments available.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img src={comment.user.image} alt={comment.user.name} className="w-10 h-10 rounded-full mr-2" />
                    <span className="font-semibold">{comment.user.name} | {comment.animeId}-episode-{comment.episodeNumber}</span>
                  </div>
                  <p>{comment.text}</p>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="bg-green-500 text-gray-800 px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(comment._id)}
                      className="bg-red-500 text-gray-800 px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <button
          onClick={() => {
            signOut();
            localStorage.removeItem('profile');
            localStorage.removeItem('history');
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full mt-6"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
