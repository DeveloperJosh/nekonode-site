// lib/news.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const newsDirectory = path.join(process.cwd(), 'public', 'news');

export function getNewsPosts() {
  const fileNames = fs.readdirSync(newsDirectory);
  const newsPosts = fileNames.map((fileName) => {
    const filePath = path.join(newsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = fileName.replace(/\.md$/, '');

    return {
      slug,
      title: data.title,
      date: data.date,
      content,
    };
  });

  return newsPosts;
}

export function getAllNewsSlugs() {
  const fileNames = fs.readdirSync(newsDirectory);
  return fileNames.map(fileName => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export function getNewsPostBySlug(slug) {
  const filePath = path.join(newsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    content,
  };
}
