import '../styles/globals.css';
import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CookieConsent from "react-cookie-consent";
import Footer from '../components/Footer';
import Heartbeat from '@/components/Heartbeat';
import { SessionProvider } from "next-auth/react";

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
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#01a0e9" />
        <meta name="description" content="NekoNode the best Anime CLI/Site there is" />
        <meta property="og:title" content="NekoNode" />
        <meta property="og:description" content="NekoNode the best Anime CLI/Site there is" />
        <title>NekoNode</title>
      </Head>
      <div className="bg-gray-900 min-h-screen text-gray-200 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Component {...pageProps} />
          <Heartbeat />
          <CookieConsent
            location="bottom"
            buttonText="Yes I do!"
            cookieName="myAwesomeCookieName2"
             style={{ background: "#2B373B" }}
             buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
              expires={150}
          >
          This website uses cookies to enhance the user experience.{" "}
         </CookieConsent>
        </div>
        <Footer />
      </div>
      </SessionProvider>
    </>
  );
}

export default MyApp;
