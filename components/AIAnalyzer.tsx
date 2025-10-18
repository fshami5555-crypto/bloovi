import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';

interface AIAnalyzerProps {
  setPage: (page: string) => void;
}

const AIAnalyzer: React.FC<AIAnalyzerProps> = ({ setPage }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'image' | 'url'>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [textInput, setTextInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setAnalysisResult('');
      setError('');
    }
  };

  const handleAnalysis = async () => {
    if ((activeTab === 'image' && !imageFile) || (activeTab === 'url' && !textInput.trim())) {
      return;
    }

    setIsLoading(true);
    setAnalysisResult('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      let response;

      if (activeTab === 'image' && imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: t.aiAnalyzer.imagePrompt }, imagePart] },
        });
      } else if (activeTab === 'url' && textInput.trim()) {
        // FIX: Combine the prompt with the user-provided URL before sending to the API.
        const prompt = `${t.aiAnalyzer.urlPrompt}\n\nURL: ${textInput}`;
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
      }
      
      if (response) {
        setAnalysisResult(response.text);
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError(t.aiAnalyzer.errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-gray-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t.aiAnalyzer.title}</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{t.aiAnalyzer.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
          <div className="flex border-b border-gray-600 mb-6">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'image' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400 hover:text-white'}`}
            >
              {t.aiAnalyzer.imageTab}
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'url' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400 hover:text-white'}`}
            >
              {t.aiAnalyzer.urlTab}
            </button>
          </div>

          {activeTab === 'image' ? (
            <div className="text-center">
              <label htmlFor="image-upload" className="cursor-pointer group">
                <div className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center group-hover:border-lime-400 transition-colors">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="h-full w-full object-contain p-2" />
                  ) : (
                    <div className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7z" /></svg>
                      <p className="mt-2">{t.aiAnalyzer.uploadLabel}</p>
                    </div>
                  )}
                </div>
              </label>
              <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          ) : (
            <div>
              <input
                type="url"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t.aiAnalyzer.urlPlaceholder}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={handleAnalysis}
              disabled={isLoading || (activeTab === 'image' && !imageFile) || (activeTab === 'url' && !textInput.trim())}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? t.aiAnalyzer.loadingText : t.aiAnalyzer.analyzeButton}
            </button>
          </div>

          {(analysisResult || error) && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-xl font-bold mb-4">{t.aiAnalyzer.resultTitle}</h3>
              {error ? (
                 <p className="text-red-400">{error}</p>
              ) : (
                 <div className="bg-gray-900/50 p-4 rounded-lg text-gray-300 whitespace-pre-wrap">{analysisResult}</div>
              )}
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage('signup')}
                  className="bg-lime-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-400/20"
                >
                  {t.aiAnalyzer.cta}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIAnalyzer;
