import React, { useState } from 'react';
import { useContent, BlogPost } from '../../contexts/ContentContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { GoogleGenAI } from '@google/genai';

const BlogManager: React.FC = () => {
    const { content, addPost, updatePost, deletePost } = useContent();
    const { t, language } = useLanguage();
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
    };

    const handleNew = () => {
        setEditingPost({
            id: 0, // 0 for a new post
            title: { en: '', ar: '' },
            content: { en: '', ar: '' },
            author: 'Admin', // Default author
            date: new Date().toISOString(),
            image: ''
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t.dashboardPage.confirmDelete)) {
            deletePost(id);
        }
    };
    
    const handleSave = (postToSave: BlogPost) => {
        if (postToSave.id === 0) { // New post
            const { id, ...newPostData } = postToSave;
            addPost(newPostData);
        } else { // Existing post
            updatePost(postToSave);
        }
        setEditingPost(null);
    };

    if (editingPost) {
        return (
            <PostEditor 
                post={editingPost} 
                onSave={handleSave} 
                onCancel={() => setEditingPost(null)}
            />
        );
    }
    
    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-lime-400">{t.dashboardPage.blogTab}</h2>
                <button onClick={handleNew} className="bg-lime-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-lime-300">
                    {t.dashboardPage.newPost}
                </button>
            </div>
            <div className="space-y-4">
                {content.blog.posts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-bold">{post.title[language]}</p>
                            <p className="text-sm text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEdit(post)} className="text-blue-400 hover:text-blue-300">Edit</button>
                            <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-300">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface PostEditorProps {
    post: BlogPost;
    onSave: (post: BlogPost) => void;
    onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        ...post,
        metaTitle: post.metaTitle || { en: '', ar: '' },
        metaDescription: post.metaDescription || { en: '', ar: '' },
    });
    const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [field, lang] = name.split('.');

        if (lang) { // Handle nested fields like 'title.en'
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...(prev as any)[field],
                    [lang]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleGenerateMeta = async () => {
        if (!formData.title.en || !formData.content.en) {
            alert('Please fill in at least the English title and content before generating SEO meta.');
            return;
        }
        setIsGeneratingMeta(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const enContentSummary = formData.content.en.substring(0, 1500);
            const arContentSummary = formData.content.ar.substring(0, 1500);

            const prompt = `Based on the following blog post, generate SEO-optimized meta titles (max 60 characters each) and meta descriptions (max 160 characters each) for both English and Arabic. Return ONLY a valid JSON object with this exact structure: { "en": { "metaTitle": "...", "metaDescription": "..." }, "ar": { "metaTitle": "...", "metaDescription": "..." } }.\n\nEnglish Title: ${formData.title.en}\nEnglish Content: ${enContentSummary}...\n\nArabic Title: ${formData.title.ar}\nArabic Content: ${arContentSummary}...`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            let jsonString = response.text.trim();
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.substring(7, jsonString.length - 3).trim();
            } else if (jsonString.startsWith('```')) {
                jsonString = jsonString.substring(3, jsonString.length - 3).trim();
            }
            
            const generatedData = JSON.parse(jsonString);
            
            setFormData(prev => ({
                ...prev,
                metaTitle: {
                    en: generatedData.en.metaTitle,
                    ar: generatedData.ar.metaTitle,
                },
                metaDescription: {
                    en: generatedData.en.metaDescription,
                    ar: generatedData.ar.metaDescription,
                },
            }));

        } catch (error) {
            console.error("Failed to generate SEO meta:", error);
            alert('An error occurred while generating SEO metadata. Please check the console for details.');
        } finally {
            setIsGeneratingMeta(false);
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-lime-400 mb-6">{post.id === 0 ? t.dashboardPage.newPost : t.dashboardPage.editPost}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.postTitleEnLabel}</label>
                        <input type="text" name="title.en" value={formData.title.en} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.postTitleArLabel}</label>
                        <input type="text" name="title.ar" value={formData.title.ar} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" dir="rtl" required />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.postImageLabel}</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.postContentEnLabel}</label>
                        <textarea name="content.en" value={formData.content.en} onChange={handleChange} rows={10} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.postContentArLabel}</label>
                        <textarea name="content.ar" value={formData.content.ar} onChange={handleChange} rows={10} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" dir="rtl" required />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.postAuthorLabel}</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.postDateLabel}</label>
                        <input type="date" name="date" value={new Date(formData.date).toISOString().split('T')[0]} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" required />
                    </div>
                </div>

                {/* SEO Meta Section */}
                <div className="pt-6 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-200">{t.dashboardPage.seoSection}</h3>
                        <button
                            type="button"
                            onClick={handleGenerateMeta}
                            disabled={isGeneratingMeta}
                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
                        >
                            {isGeneratingMeta ? t.dashboardPage.generating : t.dashboardPage.generateSeoMeta}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.metaTitleLabel} (EN)</label>
                                <input type="text" name="metaTitle.en" value={formData.metaTitle.en} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.metaTitleLabel} (AR)</label>
                                <input type="text" name="metaTitle.ar" value={formData.metaTitle.ar} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" dir="rtl" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.metaDescriptionLabel} (EN)</label>
                            <textarea name="metaDescription.en" value={formData.metaDescription.en} onChange={handleChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t.dashboardPage.metaDescriptionLabel} (AR)</label>
                            <textarea name="metaDescription.ar" value={formData.metaDescription.ar} onChange={handleChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3" dir="rtl" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="bg-lime-400 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-lime-300">{t.dashboardPage.savePost}</button>
                </div>
            </form>
        </div>
    );
};

export default BlogManager;
