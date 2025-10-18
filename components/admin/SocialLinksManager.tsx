import React, { useState, useEffect } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useLanguage } from '../../contexts/LanguageContext';

const SocialLinksManager: React.FC = () => {
    const { content, updateSocialLink } = useContent();
    const { t } = useLanguage();
    const [formData, setFormData] = useState(content.socials);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        setFormData(content.socials);
    }, [content]);

    const handleChange = (id: string, value: string) => {
        setFormData(prevData =>
            prevData.map(link => (link.id === id ? { ...link, url: value } : link))
        );
    };

    const handleSave = () => {
        formData.forEach(link => {
            updateSocialLink(link.id, link.url);
        });
        setSaveStatus(t.dashboardPage.changesSaved);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-lime-400 mb-6">{t.dashboardPage.socialsTab}</h2>
            <div className="space-y-6">
                {formData.map(link => (
                    <div key={link.id}>
                        <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">{link.name}</label>
                        <input
                            type="url"
                            value={link.url}
                            onChange={e => handleChange(link.id, e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-8 text-right">
                {saveStatus && <p className="text-lime-400 text-sm mb-2 inline-block mr-4">{saveStatus}</p>}
                <button onClick={handleSave} className="bg-lime-400 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-lime-300 transition-all">
                    {t.dashboardPage.saveChanges}
                </button>
            </div>
        </div>
    );
};

export default SocialLinksManager;
