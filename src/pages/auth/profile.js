import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import UpdateToList from '@/components/UpdateToList';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [animeList, setAnimeList] = useState([]);
  const [activeTab, setActiveTab] = useState(router.query.tab || 'profile');
  const [loadingAnimeList, setLoadingAnimeList] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [okMessage, setOkMessage] = useState('');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    autoplay: false,
    preload: false,
    only_dub: false,
    only_sub: false,
  });

  useEffect(() => {
    if (session) {
      const fetchAnimeList = async () => {
        setLoadingAnimeList(true);
        try {
          const response = await axios.get('/api/animelist/get');
          setAnimeList(response.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching anime list:', error);
          setError('Failed to fetch anime list');
        } finally {
          setLoadingAnimeList(false);
        }
      };

      fetchAnimeList();

      if (session.user.role === 'moderator' || session.user.role === 'admin') {
        const fetchComments = async () => {
          setLoadingComments(true);
          try {
            const response = await axios.get('/api/mod/comments/pending');
            setComments(response.data);
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

      const fetchSettings = async () => {
        try {
          const response = await axios.get('/api/settings');
          setSettings(response.data);
        } catch (error) {
          console.error('Error fetching user settings:', error);
          setError('Failed to fetch user settings');
        }
      };

      fetchSettings();
    }
  }, [session]);

  const nametolong = (name) => {
    if (name.length > 25) {
      return name.substring(0, 25) + '...';
    }
    return name;
  };

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

  const capitalize = (text) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const removeAnime = async (animeId) => {
    try {
      await axios.delete('/api/animelist/delete', { data: { animeId } });
      setAnimeList(animeList.filter(anime => anime.animeId !== animeId));
      setOkMessage('Anime removed from your list.');
    } catch (error) {
      console.error('Failed to remove anime:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, undefined, { shallow: true });
  };

  const openUpdateModal = (anime) => {
    setSelectedAnime(anime);
    setIsModalOpen(true);
  };

  const handleUpdateAnime = async (animeId, status) => {
    try {
      await axios.put('/api/animelist/update', {
        animeId,
        status,
        lastWatchedAt: new Date(),
      });
      setAnimeList(animeList.map(anime => anime.animeId === animeId ? { ...anime, status } : anime));
      setIsModalOpen(false);
      setOkMessage('Anime status updated successfully.');
    } catch (error) {
      console.error('Failed to update anime status:', error);
      setError('Failed to update anime status');
    }
  };

  const handleSettingChange = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
    updateSettings(setting, !settings[setting]);
  };

  const updateSettings = async (setting, value) => {
    try {
      await axios.put('/api/settings', {
        [setting]: value,
      });
      setOkMessage('Settings updated successfully.');
    } catch (error) {
      console.error('Failed to update settings:', error);
      setError('Failed to update settings');
    }
  };

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p className="text-center text-red-500">Please log in to view your dashboard.</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-gray-200">
      <div className="bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-yellow-500 mb-4 sm:mb-6 text-center">Your Dashboard</h2>

        <div className="mb-4 sm:mb-6 flex justify-around">
          <button
            onClick={() => handleTabChange('profile')}
            className={`py-2 px-2 sm:px-4 ${activeTab === 'profile' ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            Profile
          </button>
          <button
            onClick={() => handleTabChange('animelist')}
            className={`py-2 px-2 sm:px-4 ${activeTab === 'animelist' ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            Anime List
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`py-2 px-2 sm:px-4 ${activeTab === 'settings' ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            Settings
          </button>
          {(session.user.role === 'moderator' || session.user.role === 'admin') && (
            <button
              onClick={() => handleTabChange('moderation')}
              className={`py-2 px-2 sm:px-4 ${activeTab === 'moderation' ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              Moderation
            </button>
          )}
        </div>

        {activeTab === 'profile' && (
          <div className="text-center">
            <Image 
              src={session.user.image} 
              alt={session.user.name} 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4" 
              width={64} 
              height={64} 
            />
            <p className="text-lg sm:text-xl">Name: <span className="font-bold">{session.user.name}</span></p>
            <p className="text-lg sm:text-xl">ID: <span className="font-bold">{session.user.id}</span></p>
            <p className="text-lg sm:text-xl">Created At: <span className="font-bold">{formatDate(session.user.createdAt)}</span></p>
          </div>
        )}

        {activeTab === 'animelist' && (
          <div className={`grid grid-cols-1 gap-4 ${animeList.length > 2 ? 'max-h-96 overflow-y-auto pr-4' : ''}`}>
            {loadingAnimeList ? (
              <p className="text-lg sm:text-xl text-center">Loading anime list...</p>
            ) : error ? (
              <p className="text-lg sm:text-xl text-center text-red-500">{error}</p>
            ) : animeList.length === 0 ? (
              <p className="text-lg sm:text-xl text-center">No anime in your list.</p>
            ) : (
              animeList.map((item, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row items-center sm:items-start">
                  <div className="flex-shrink-0 w-24 h-36 sm:w-32 sm:h-48 mr-0 sm:mr-4 mb-4 sm:mb-0">
                    <Image 
                      src={item.image} 
                      alt={item.animeId} 
                      width={128} 
                      height={192} 
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-md sm:text-lg font-bold truncate">{nametolong(item.name)}</p>
                    <p className="text-sm sm:text-md">Status: {capitalize(item.status)}</p>
                    <p className="text-sm sm:text-md">Last Time Watched: {formatDate(item.lastWatchedAt)}</p>
                    <p>
                      <Link href={`/anime/${item.animeId}`} className="text-blue-500 hover:text-blue-700">
                        Watch Anime
                      </Link>
                    </p>
                    <div className="flex space-x-2 sm:space-x-4 mt-2">
                      <button
                        className="bg-yellow-500 text-gray-800 px-2 sm:px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        onClick={() => openUpdateModal(item)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-gray-800 px-2 sm:px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={() => removeAnime(item.animeId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-4 sm:mb-6">Settings</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="autoplay" className="text-lg sm:text-xl">Auto Play:</label>
                <input 
                  type="checkbox" 
                  id="autoplay" 
                  name="autoplay" 
                  className="w-6 h-6" 
                  checked={settings.autoplay} 
                  onChange={() => handleSettingChange('autoplay')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="preload" className="text-lg sm:text-xl">Preload:</label>
                <input 
                  type="checkbox" 
                  id="preload" 
                  name="preload" 
                  className="w-6 h-6" 
                  checked={settings.preload} 
                  onChange={() => handleSettingChange('preload')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="only_dub" className="text-lg sm:text-xl">Only Dub:</label>
                <input 
                  type="checkbox" 
                  id="only_dub" 
                  name="only_dub" 
                  className="w-6 h-6" 
                  checked={settings.only_dub} 
                  onChange={() => handleSettingChange('only_dub')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="only_sub" className="text-lg sm:text-xl">Only Sub:</label>
                <input 
                  type="checkbox" 
                  id="only_sub" 
                  name="only_sub" 
                  className="w-6 h-6" 
                  checked={settings.only_sub} 
                  onChange={() => handleSettingChange('only_sub')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (session.user.role === 'moderator' || session.user.role === 'admin') && (
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-4"> {/* Added padding-right */}
            {loadingComments ? (
              <p className="text-lg sm:text-xl text-center">Loading comments...</p>
            ) : error ? (
              <p className="text-lg sm:text-xl text-center text-red-500">{error}</p>
            ) : comments.length === 0 ? (
              <p className="text-lg sm:text-xl text-center">No pending comments available.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Image 
                      src={comment.user.image} 
                      alt={comment.user.name} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2" 
                      width={40} 
                      height={40} 
                    />
                    <span className="font-semibold">{comment.user.name} | {comment.animeId}-episode-{comment.episodeNumber}</span>
                  </div>
                  <p>{comment.text}</p>
                  <div className="flex space-x-2 sm:space-x-4 mt-2">
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="bg-green-500 text-gray-800 px-2 sm:px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(comment._id)}
                      className="bg-red-500 text-gray-800 px-2 sm:px-4 py-2 rounded hover:bg-red-600"
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
            localStorage.removeItem('animelist');
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full mt-6"
        >
          Logout
        </button>
      </div>
      {okMessage && ( 
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center">
          <span>{okMessage}</span>
          <button
            onClick={() => setOkMessage('')}
            className="ml-4 text-white font-bold"
          >
            &times;
          </button>
        </div>
       )}
      {isModalOpen && (
        <UpdateToList
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          anime={selectedAnime}
          onUpdate={handleUpdateAnime}
        />
      )}
    </div>
  );
};

export default Dashboard;
