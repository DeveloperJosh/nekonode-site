// components/Heartbeat.js

import { useEffect } from 'react';
import axios from 'axios';

const Heartbeat = () => {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await axios.post('/api/heartbeat');
        console.log('Heartbeat sent successfully');
      } catch (error) {
        console.error('Error sending heartbeat:', error);
      }
    };

    // Send the initial heartbeat
    sendHeartbeat();

    // Set up an interval to send heartbeat every 5 minutes
    const intervalId = setInterval(sendHeartbeat, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default Heartbeat;
