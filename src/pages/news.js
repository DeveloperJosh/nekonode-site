// pages/news.js

import React from 'react';
import Link from 'next/link';
import { getNewsPosts } from '../lib/news';

const News = ({ posts }) => {
  return (
    <div className="news-page container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">News</h1>
      {posts.map((post) => (
        <div key={post.slug} className="news-post border-b border-gray-700 py-6">
          <Link href={`/news/${post.slug}`} className="text-2xl font-bold mb-2 text-yellow-400 hover:underline">
            {post.title}
          </Link>
          <p className="news-date text-gray-500 text-sm mb-4">{post.date}</p>
          <p className="text-gray-200">{post.content.slice(0, 100)}...</p>
        </div>
      ))}
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
