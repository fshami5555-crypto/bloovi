import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { initialContent } from '../translations';
import { set } from './utils';

// Interfaces
export interface BlogPost {
  id: number;
  title: { en: string; ar: string };
  content: { en: string; ar: string };
  author: string;
  date: string;
  image: string;
  metaTitle?: { en: string; ar: string };
  metaDescription?: { en: string; ar: string };
}

export interface SocialLink {
    id: string;
    name: string;
    url: string;
    icon: string;
}

interface ClientImage {
    id: number;
    url: string;
    alt: string;
}

interface Content {
  en: any;
  ar: any;
  images: {
    hero: string;
    clients: ClientImage[];
  };
  blog: {
    posts: BlogPost[];
  };
  socials: SocialLink[];
}

interface ContentContextType {
  content: Content;
  updateTextContent: (lang: 'en' | 'ar', path: string, value: string) => void;
  updateImageContent: (key: 'hero', value: string) => void;
  updateClientImageURL: (id: number, url: string) => void;
  getPostById: (id: number) => BlogPost | undefined;
  addPost: (postData: Omit<BlogPost, 'id'>) => void;
  updatePost: (updatedPost: BlogPost) => void;
  deletePost: (id: number) => void;
  updateSocialLink: (id: string, url: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const CONTENT_STORAGE_KEY = 'websiteContent';

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Content>(() => {
    try {
      const storedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (storedContent) {
        return JSON.parse(storedContent);
      }
    } catch (error) {
      console.error("Failed to parse content from localStorage", error);
    }
    return initialContent;
  });
  
  useEffect(() => {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const updateTextContent = (lang: 'en' | 'ar', path: string, value: string) => {
    setContent(prevContent => {
      const newContent = JSON.parse(JSON.stringify(prevContent));
      set(newContent[lang], path, value);
      return newContent;
    });
  };

  const updateImageContent = (key: 'hero', value: string) => {
    setContent(prevContent => ({
      ...prevContent,
      images: {
        ...prevContent.images,
        [key]: value
      }
    }));
  };

  const updateClientImageURL = (id: number, url: string) => {
    setContent(prevContent => ({
        ...prevContent,
        images: {
            ...prevContent.images,
            clients: prevContent.images.clients.map(img =>
                img.id === id ? { ...img, url } : img
            )
        }
    }));
  };
  
  const getPostById = (id: number): BlogPost | undefined => {
      return content.blog.posts.find(p => p.id === id);
  };
  
  const addPost = (postData: Omit<BlogPost, 'id'>) => {
    setContent(prevContent => {
        const newPost = {
            ...postData,
            id: Date.now(), // Simple unique ID
        };
        return {
            ...prevContent,
            blog: {
                ...prevContent.blog,
                posts: [newPost, ...prevContent.blog.posts]
            }
        };
    });
  };
  
  const updatePost = (updatedPost: BlogPost) => {
    setContent(prevContent => ({
        ...prevContent,
        blog: {
            ...prevContent.blog,
            posts: prevContent.blog.posts.map(p =>
                p.id === updatedPost.id ? updatedPost : p
            )
        }
    }));
  };
  
  const deletePost = (id: number) => {
      setContent(prevContent => ({
          ...prevContent,
          blog: {
              ...prevContent.blog,
              posts: prevContent.blog.posts.filter(p => p.id !== id)
          }
      }));
  };

  const updateSocialLink = (id: string, url: string) => {
      setContent(prevContent => ({
          ...prevContent,
          socials: prevContent.socials.map(link => 
              link.id === id ? { ...link, url } : link
          )
      }));
  };

  return (
    <ContentContext.Provider value={{ content, updateTextContent, updateImageContent, updateClientImageURL, getPostById, addPost, updatePost, deletePost, updateSocialLink }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
