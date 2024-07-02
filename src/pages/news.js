// pages/news.js

import React from 'react';
import Link from 'next/link';
import { getNewsPosts } from '../lib/news';

const News = ({ posts }) => {
  return (
    <div className="news-page container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">News</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.slug} className="news-post border-b border-gray-700 py-6">
            <Link href={`/news/${post.slug}`}>
              <a className="text-2xl font-bold mb-2 text-yellow-400 hover:underline">{post.title}</a>
            </Link>
            <p className="news-date text-gray-500 text-sm mb-4">{post.date}</p>
            <Link href={`/news/${post.slug}`}>
              <a className="bg-yellow-500 text-gray-800 px-4 py-2 text-lg sm:text-xl rounded hover:bg-yellow-600">
                Read More
              </a>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No news ;(.....</p>
      )}
    </div>
  );
};

export async function getStaticProps() {
  const posts = getNewsPosts();

  return {
    props: {
      posts,
    },
  };
}

export default News;
