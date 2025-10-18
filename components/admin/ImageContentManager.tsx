import React, { useState, useEffect } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useLanguage } from '../../contexts/LanguageContext';

const ImageContentManager: React.FC = () => {
    const { content, updateImageContent, updateClientImageURL } = useContent();
    const { t } = useLanguage();
    const [formData, setFormData] = useState(content.images);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        setFormData(content.images);
    }, [content]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageIdentifier: 'hero' | number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (imageIdentifier === 'hero') {
                    setFormData(prev => ({ ...prev, hero: base64String }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        clients: prev.clients.map(img =>
                            img.id === imageIdentifier ? { ...img, url: base64String } : img
                        )
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateImageContent('hero', formData.hero);
        formData.clients.forEach((img) => {
            updateClientImageURL(img.id, img.url);
        });
        setSaveStatus(t.dashboardPage.changesSaved);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-lime-400 mb-6">{t.dashboardPage.imagesTab}</h2>
            
            <div className="mb-8 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">{t.dashboardPage.heroImage}</h3>
                 <div className="flex items-center gap-4">
                    <img src={formData.hero} alt="Hero Preview" className="w-24 h-24 rounded-md object-cover bg-gray-700"/>
                    <div>
                        <input
                            type="file"
                            id="hero-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'hero')}
                        />
                        <label htmlFor="hero-image-upload" className="cursor-pointer bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">
                            {t.dashboardPage.uploadImage}
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">{t.dashboardPage.clientImages}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.clients.map((image) => (
                    <div key={image.id} className="bg-gray-900/50 p-4 rounded-lg flex items-center gap-4">
                         <img src={image.url} alt={image.alt} className="w-24 h-24 rounded-md object-cover bg-gray-700"/>
                         <div>
                            <label className="block text-sm font-bold text-gray-200 mb-2 capitalize">{image.alt}</label>
                             <input
                                type="file"
                                id={`client-image-upload-${image.id}`}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, image.id)}
                            />
                            <label htmlFor={`client-image-upload-${image.id}`} className="cursor-pointer bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">
                                {t.dashboardPage.uploadImage}
                            </label>
                         </div>
                    </div>
                ))}
                </div>
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

export default ImageContentManager;