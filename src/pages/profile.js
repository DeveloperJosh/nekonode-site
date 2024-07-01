import { useEffect, useState } from 'react';
import withAuth from '../hoc/withAuth';
import axios from 'axios';
import { logout } from '../utils/auth';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const cachedProfile = localStorage.getItem('profile');

      if (cachedProfile) {
        const profile = JSON.parse(cachedProfile);
        setUsername(profile.username);
        setEmail(profile.email);
      } else {
        try {
          const profileResponse = await axios.get('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const profile = profileResponse.data;
          setUsername(profile.username);
          setEmail(profile.email);
          localStorage.setItem('profile', JSON.stringify(profile));
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-6 text-center">Your Profile</h2>
        <div className="text-center mb-4">
          <p className="text-xl sm:text-2xl">Username: <span className="font-bold">{username}</span></p>
          <p className="text-xl sm:text-2xl">Email: <span className="font-bold">{email}</span></p> {/* Email displayed inline */}
        </div>
        <button
          onClick={() => {
            logout();
            localStorage.removeItem('profile'); // Clear cached profile on logout
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
