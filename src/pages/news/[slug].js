// pages/news/[slug].js

import React from 'react';
import { getAllNewsSlugs, getNewsPostBySlug } from '../../lib/news';
import ReactMarkdown from 'react-markdown';

const NewsPost = ({ post }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">{post.date}</p>
      <div className="text-gray-200">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-4" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-4" {...props} />,
            p: ({ node, ...props }) => <p className="my-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside my-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-4" {...props} />,
            a: ({ node, ...props }) => <a className="text-yellow-400 underline" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-yellow-400 pl-4 italic my-4" {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const paths = getAllNewsSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getNewsPostBySlug(params.slug);
  return {
    props: {
      post,
    },
  };
}

export default NewsPost;
