import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const History = () => {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (session) {
      const fetchHistory = async () => {
        const res = await axios.get('/api/history');
        setHistory(res.data);
      };
      fetchHistory();
    }
  }, [session]);

  if (!session) {
    return <p>Please log in to see your history.</p>;
  }

  return (
    <div>
      <h3>Watch History</h3>
      <ul>
        {history.map((item) => (
          <li key={item._id}>
            {item.animeId} - Episode {item.episodeNumber} watched on {new Date(item.watchedAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
