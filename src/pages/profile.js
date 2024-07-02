import { useEffect, useState } from 'react';
import withAuth from '../hoc/withAuth';
import axios from 'axios';
import { logout } from '../utils/auth';
import Link from 'next/link';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      try {
        const profileResponse = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = profileResponse.data;
        setUsername(profile.username);
        setEmail(profile.email);
        localStorage.setItem('profile', JSON.stringify(profile));

        // Fetch history
        const historyResponse = await axios.get('/api/history/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyResponse.data);
        localStorage.setItem('history', JSON.stringify(historyResponse.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (typeof window !== 'undefined') {
      const profile = JSON.parse(localStorage.getItem('profile'));
      const storedHistory = JSON.parse(localStorage.getItem('history'));

      if (profile) {
        setUsername(profile.username);
        setEmail(profile.email);
      }

      if (storedHistory) {
        setHistory(storedHistory);
      } else {
        fetchUserProfile();
      }
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-6 text-center">Your Profile</h2>

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
            History
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-4 ${activeTab === 'settings' ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="text-center">
            <p className="text-xl sm:text-2xl">Username: <span className="font-bold">{username}</span></p>
            <p className="text-xl sm:text-2xl">Email: <span className="font-bold">{email}</span></p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 gap-4">
            <p className="text-xl sm:text-2xl text-center">Not yet added..</p>
            {history.map((item, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <p className="text-lg font-bold">Anime: {item.name}</p>
                <p>Episode: {item.episodeNumber}</p>
                <p>
                  <Link className="text-blue-500 hover:text-blue-700" href={`/anime/${item.animeId}`}>
                    Watch Anime 
                  </Link>
                </p>
                <p>Watched: {formatDate(item.watchedAt)}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center">
            <p className="text-xl sm:text-2xl">User settings panel here</p>
          </div>
        )}

        <button
          onClick={() => {
            logout();
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

export default withAuth(Profile);
