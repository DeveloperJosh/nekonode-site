// components/NewsPost.js

import React from 'react';
import ReactMarkdown from 'react-markdown';

const NewsPost = ({ title, date, content }) => {
  return (
    <div className="news-post border-b border-gray-700 py-6">
      <h2 className="news-title text-3xl font-bold mb-2 text-gray-400">{title}</h2>
      <p className="news-date text-gray-500 text-sm mb-4">{date}</p>
      <div className=" text-gray-300">
        <p className="text-lg">{content}</p>
      </div>
    </div>
  );
};

export default NewsPost;
