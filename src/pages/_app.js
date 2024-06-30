import '../styles/globals.css';
import { useEffect } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.classList.add(
      'scrollbar-thumb-rounded',
      'scrollbar-thin',
      'scrollbar-thumb-yellow-500',
      'scrollbar-track-gray-700'
    );
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#01a0e9" />
        <meta name="description" content="NekoNode the best Anime CLI/Site there is" />
        <meta property="og:title" content="NekoNode" />
        <meta property="og:description" content="NekoNode the best Anime CLI/Site there is" />
        <title>NekoNode</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
