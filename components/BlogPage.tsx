import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';

interface BlogPageProps {
  setPage: (page: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ setPage }) => {
  const { t, language } = useLanguage();
  const { content } = useContent();
  const posts = content.blog.posts;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">{t.blogPage.title}</h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{t.blogPage.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-2xl overflow-hidden flex flex-col group">
              <img src={post.image} alt={post.title[language]} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3 flex-grow">{post.title[language]}</h2>
                <p className="text-gray-400 text-sm mb-4">{t.blogPage.by} {post.author} &bull; {new Date(post.date).toLocaleDateString()}</p>
                <button
                  onClick={() => setPage(`blog/${post.id}`)}
                  className="mt-auto self-start font-semibold text-lime-400 hover:text-lime-300 transition-colors"
                >
                  {t.blogPage.readMore} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;