import React, { useState, useEffect } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { get, set } from '../../contexts/utils';

const Accordion: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-700 rounded-lg mb-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700/50">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="p-4 bg-gray-800/50">{children}</div>}
    </div>
  );
};

const TextInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-lime-400" />
    </div>
);

const TextContentManager: React.FC = () => {
    const { content, updateTextContent } = useContent();
    const { t } = useLanguage();
    const [lang, setLang] = useState<'en' | 'ar'>('en');
    const [formData, setFormData] = useState(content[lang]);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        setFormData(content[lang]);
    }, [lang, content]);

    const handleChange = (path: string, value: string) => {
        setFormData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy for safety
            set(newData, path, value);
            return newData;
        });
    };

    const handleSave = () => {
        Object.keys(formData).forEach(sectionKey => {
            if (typeof formData[sectionKey] === 'object' && formData[sectionKey] !== null) {
                Object.keys(formData[sectionKey]).forEach(fieldKey => {
                    const path = `${sectionKey}.${fieldKey}`;
                    const value = get(formData, path);
                    if (typeof value === 'string') {
                         updateTextContent(lang, path, value);
                    } else if (Array.isArray(value)) {
                        // Handle arrays of strings, like hero.titles
                        value.forEach((item, index) => {
                             if (typeof item === 'string') {
                                updateTextContent(lang, `${path}.${index}`, item);
                            }
                        });
                    }
                });
            }
        });
        setSaveStatus(t.dashboardPage.changesSaved);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-lime-400">{t.dashboardPage.textTab}</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm">{t.dashboardPage.editContentFor}</span>
                    <select value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'ar')} className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2">
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                    </select>
                </div>
            </div>

            <Accordion title={t.dashboardPage.heroSection}>
                {formData.hero.titles?.map((title: string, index: number) => (
                    <TextInput 
                        key={index}
                        label={t.dashboardPage[`heroTitle${index + 1}` as keyof typeof t.dashboardPage]} 
                        value={title} 
                        onChange={e => handleChange(`hero.titles.${index}`, e.target.value)} 
                    />
                ))}
                <TextInput label={t.dashboardPage.formSubtitleLabel} value={formData.hero.subtitle} onChange={e => handleChange('hero.subtitle', e.target.value)} />
                <TextInput label={t.dashboardPage.ctaButton} value={formData.hero.cta} onChange={e => handleChange('hero.cta', e.target.value)} />
            </Accordion>
            
            <Accordion title={t.dashboardPage.servicesSection}>
                <TextInput label={t.dashboardPage.formTitleLabel} value={formData.services.title} onChange={e => handleChange('services.title', e.target.value)} />
                <TextInput label={t.dashboardPage.formSubtitleLabel} value={formData.services.subtitle} onChange={e => handleChange('services.subtitle', e.target.value)} />
            </Accordion>

            <Accordion title={t.dashboardPage.approachSection}>
                <TextInput label={t.dashboardPage.formTitleLabel} value={formData.approach.title} onChange={e => handleChange('approach.title', e.target.value)} />
                <TextInput label={t.dashboardPage.formSubtitleLabel} value={formData.approach.subtitle} onChange={e => handleChange('approach.subtitle', e.target.value)} />
            </Accordion>

            <Accordion title={t.dashboardPage.footerSection}>
                <TextInput label={t.dashboardPage.formTitleLabel} value={formData.footer.contactInfo} onChange={e => handleChange('footer.contactInfo', e.target.value)} />
                <TextInput label={t.dashboardPage.emailLabel} value={formData.footer.email} onChange={e => handleChange('footer.email', e.target.value)} />
                <TextInput label={t.dashboardPage.phoneLabel} value={formData.footer.phone} onChange={e => handleChange('footer.phone', e.target.value)} />
            </Accordion>

            <div className="mt-8 text-right">
                {saveStatus && <p className="text-lime-400 text-sm mb-2 inline-block mr-4">{saveStatus}</p>}
                <button onClick={handleSave} className="bg-lime-400 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-lime-300 transition-all">
                    {t.dashboardPage.saveChanges}
                </button>
            </div>
        </div>
    );
};

export default TextContentManager;