import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setMessageType('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType('success');
        setMessage(data.message);
        //router.push('/auth/login');
      } else {
        setMessageType('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-6 text-center">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          {message && (
            <div
              className={`mb-4 text-center font-bold ${
                messageType === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {message}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-yellow-500 text-gray-800 px-4 py-2 font-bold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Reset Password
            </button>
          </div>
        </form>
        <p className="mt-6 text-center">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-yellow-500 hover:text-yellow-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
