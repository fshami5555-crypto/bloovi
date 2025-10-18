import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SinglePostPageProps {
  postId: number;
  setPage: (page: string) => void;
}

const SinglePostPage: React.FC<SinglePostPageProps> = ({ postId, setPage }) => {
  const { getPostById } = useContent();
  const { t, language } = useLanguage();
  const post = getPostById(postId);

  if (!post) {
    return (
      <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Post not found</h1>
          <button onClick={() => setPage('blog')} className="mt-8 text-lime-400 hover:underline">
            &larr; Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => setPage('blog')} className="mb-8 text-lime-400 hover:underline">
          &larr; {t.blogPage.title}
        </button>
        <img src={post.image} alt={post.title[language]} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title[language]}</h1>
        <p className="text-gray-400 mb-8">
          {t.blogPage.by} {post.author} &bull; {new Date(post.date).toLocaleDateString()}
        </p>
        <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post.content[language]}
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;