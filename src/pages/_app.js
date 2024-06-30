import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.classList.add('scrollbar-thumb-rounded', 'scrollbar-thin', 'scrollbar-thumb-yellow-500', 'scrollbar-track-gray-700');
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
