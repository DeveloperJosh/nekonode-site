import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <span className="text-lg font-semibold">NekoNode</span>
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <nav className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <a href="/about" className="text-gray-300 hover:text-white px-3 py-2">About Us</a>
            <a href="/contact" className="text-gray-300 hover:text-white px-3 py-2">Contact</a>
            <a href="/privacy" className="text-gray-300 hover:text-white px-3 py-2">Privacy Policy</a>
            <a href="/terms" className="text-gray-300 hover:text-white px-3 py-2">Terms of Service</a>
          </nav>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="https://www.facebook.com" className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12.1c0-5.5-4.5-10-10-10s-10 4.5-10 10c0 4.8 3.4 8.7 7.8 9.7v-6.9h-2.3v-2.8h2.3v-2.1c0-2.3 1.4-3.5 3.4-3.5 1 0 1.9.1 2.1.1v2.4h-1.5c-1.2 0-1.5.6-1.5 1.4v1.8h3l-.4 2.8h-2.6v6.9c4.4-1 7.8-4.9 7.8-9.7z"/>
              </svg>
            </a>
            <a href="https://www.twitter.com" className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.6c-.9.4-1.8.7-2.8.8 1-.6 1.7-1.5 2-2.7-.9.5-1.9.9-3 1.1-1.8-2-4.8-2.1-6.8-.2-1.3 1.3-1.7 3.1-1.3 4.9-4-.2-7.5-2.1-9.8-5-.4.7-.6 1.5-.6 2.4 0 1.7.9 3.2 2.3 4.1-.8 0-1.5-.3-2.1-.6v.1c0 2.3 1.6 4.3 3.8 4.8-.7.2-1.4.2-2.1.1.6 1.8 2.3 3.1 4.3 3.2-1.6 1.3-3.5 2-5.5 2-.4 0-.9 0-1.3-.1 2 1.3 4.4 2 6.9 2 8.2 0 12.7-6.8 12.7-12.7v-.6c.8-.5 1.5-1.3 2-2.1-.7.3-1.6.6-2.4.7.9-.5 1.7-1.4 2-2.4z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com" className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.5.2.8.4 1.2.8.3.3.6.7.8 1.2.2.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.5-.4.8-.8 1.2-.3.3-.7.6-1.2.8-.4.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.5-.2-.8-.4-1.2-.8-.3-.3-.6-.7-.8-1.2-.2-.4-.3-1.1-.4-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.5.4-.8.8-1.2.3-.3.7-.6 1.2-.8.4-.2 1.1-.3 2.3-.4 1.3-.1 1.7-.1 4.9-.1m0-2.2c-3.3 0-3.7 0-5 .1-1.3.1-2.2.3-3.1.6-.9.3-1.7.8-2.4 1.5-.7.7-1.2 1.5-1.5 2.4-.3.9-.5 1.8-.6 3.1-.1 1.3-.1 1.7-.1 5s0 3.7.1 5c.1 1.3.3 2.2.6 3.1.3.9.8 1.7 1.5 2.4.7.7 1.5 1.2 2.4 1.5.9.3 1.8.5 3.1.6 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.3 3.1-.6.9-.3 1.7-.8 2.4-1.5.7-.7 1.2-1.5 1.5-2.4.3-.9.5-1.8.6-3.1.1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.3-2.2-.6-3.1-.3-.9-.8-1.7-1.5-2.4-.7-.7-1.5-1.2-2.4-1.5-.9-.3-1.8-.5-3.1-.6-1.3-.1-1.7-.1-5-.1z"/>
                <path d="M12 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm0 10.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6.5-10.5c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} NekoNode. All rights reserved.</p>
        <p className="text-gray-400 mt-2">This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
      </div>
    </footer>
  );
};

export default Footer;
