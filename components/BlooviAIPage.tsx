import React, { useState, useRef, ReactNode } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import { fileToBase64, b64decode, decodeAudioData, bufferToWav } from '../utils/helpers';

interface BlooviAIPageProps {
  setPage: (page: string) => void;
}

// Helper component for loading spinners
const Loader: React.FC = () => (
    <div className="flex justify-center items-center space-x-2 my-4">
        <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse delay-150"></div>
        <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse delay-300"></div>
    </div>
);

// Helper component for styled buttons
const ActionButton: React.FC<{ onClick?: () => void, disabled?: boolean, children: ReactNode, type?: 'button' | 'submit' | 'reset' }> = ({ onClick, disabled, children, type = 'button' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
    >
        {children}
    </button>
);


// --- AI Tool Components (defined in the same file for simplicity) ---

const BackgroundRemover: React.FC = () => {
    const { t } = useLanguage();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult('');
            setError('');
        }
    };

    const handleGenerate = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = await fileToBase64(imageFile);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { text: 'Remove the background from this image. Make the background transparent.' },
                        { inlineData: { data: base64Data, mimeType: imageFile.type } }
                    ]
                },
                config: { responseModalities: [Modality.IMAGE] }
            });

            const imagePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                setResult(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            } else {
                throw new Error("No image was generated.");
            }
        } catch (err) {
            console.error(err);
            setError(t.blooviAIPage.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <label htmlFor="bg-remover-upload" className="cursor-pointer group">
                <div className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center group-hover:border-lime-400 transition-colors bg-gray-900/50">
                    {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-2" /> : <p className="text-gray-400">{t.blooviAIPage.uploadImage}</p>}
                </div>
            </label>
            <input id="bg-remover-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="mt-6">
                <ActionButton onClick={handleGenerate} disabled={!imageFile || isLoading}>
                    {isLoading ? t.blooviAIPage.generating : t.blooviAIPage.generate}
                </ActionButton>
            </div>
            {isLoading && <Loader />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {result && (
                <div className="mt-6 text-center">
                    <h3 className="font-bold mb-2">{t.blooviAIPage.result}</h3>
                    <div className="p-4 bg-gray-700/50 rounded-lg inline-block">
                       <img src={result} alt="Result" className="max-w-full h-auto max-h-64" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' x=\'0\' y=\'0\' fill=\'%23888\'/%3E%3Crect width=\'10\' height=\'10\' x=\'10\' y=\'10\' fill=\'%23888\'/%3E%3C/svg%3E")'}}/>
                    </div>
                    <a href={result} download="background-removed.png" className="block w-full text-center mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-500 transition-colors">{t.blooviAIPage.download}</a>
                </div>
            )}
        </div>
    );
};

const EmailWriter: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ sender: '', recipient: '', topic: '' });
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Write a professional email from ${formData.sender} to ${formData.recipient} about the following topic: "${formData.topic}". The email should be clear, concise, and ready to send.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });
            setResult(response.text);
        } catch (err) {
            console.error(err);
            setError(t.blooviAIPage.error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            <input type="text" name="sender" placeholder={t.blooviAIPage.senderName} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3"/>
            <input type="text" name="recipient" placeholder={t.blooviAIPage.recipientName} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3"/>
            <textarea name="topic" placeholder={t.blooviAIPage.emailTopic} rows={4} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3"></textarea>
            <div className="pt-2">
                <ActionButton onClick={handleGenerate} disabled={!formData.sender || !formData.recipient || !formData.topic || isLoading}>
                    {isLoading ? t.blooviAIPage.generating : t.blooviAIPage.generate}
                </ActionButton>
            </div>
            {isLoading && <Loader />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {result && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">{t.blooviAIPage.result}</h3>
                        <button onClick={handleCopy} className="text-sm bg-gray-600 py-1 px-3 rounded-md hover:bg-gray-500">{copied ? t.blooviAIPage.copied : t.blooviAIPage.copy}</button>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg text-gray-300 whitespace-pre-wrap border border-gray-700">{result}</div>
                </div>
            )}
        </div>
    );
};

const ImageEnhancer: React.FC = () => {
    // This component is very similar to BackgroundRemover, just with a different prompt.
    const { t } = useLanguage();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult('');
            setError('');
        }
    };

    const handleGenerate = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = await fileToBase64(imageFile);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { text: 'Enhance the quality and resolution of this image/logo. Make it sharper, clearer, and upscale it.' },
                        { inlineData: { data: base64Data, mimeType: imageFile.type } }
                    ]
                },
                config: { responseModalities: [Modality.IMAGE] }
            });
            const imagePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                setResult(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            } else {
                 throw new Error("No image was generated.");
            }
        } catch (err) {
            console.error(err);
            setError(t.blooviAIPage.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <label htmlFor="enhancer-upload" className="cursor-pointer group">
                <div className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center group-hover:border-lime-400 transition-colors bg-gray-900/50">
                    {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-2" /> : <p className="text-gray-400">{t.blooviAIPage.uploadImage}</p>}
                </div>
            </label>
            <input id="enhancer-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="mt-6">
                <ActionButton onClick={handleGenerate} disabled={!imageFile || isLoading}>
                    {isLoading ? t.blooviAIPage.generating : t.blooviAIPage.generate}
                </ActionButton>
            </div>
            {isLoading && <Loader />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {result && (
                <div className="mt-6 text-center">
                    <h3 className="font-bold mb-2">{t.blooviAIPage.result}</h3>
                     <div className="p-4 bg-gray-700/50 rounded-lg inline-block">
                       <img src={result} alt="Result" className="max-w-full h-auto max-h-64"/>
                    </div>
                    <a href={result} download="enhanced-image.png" className="block w-full text-center mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-500 transition-colors">{t.blooviAIPage.download}</a>
                </div>
            )}
        </div>
    );
};

const LogoGenerator: React.FC = () => {
    const { t } = useLanguage();
    const [companyName, setCompanyName] = useState('');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `Modern, professional, minimalist logo for an English company named "${companyName}". The logo should be on a transparent background.`,
                config: { numberOfImages: 1, outputMimeType: 'image/png' },
            });
            const base64Image = response.generatedImages[0]?.image.imageBytes;
            if (base64Image) {
                setResult(`data:image/png;base64,${base64Image}`);
            } else {
                throw new Error("No image was generated.");
            }
        } catch (err) {
            console.error(err);
            setError(t.blooviAIPage.error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <input type="text" placeholder={t.blooviAIPage.companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3"/>
            <div className="mt-6">
                <ActionButton onClick={handleGenerate} disabled={!companyName || isLoading}>
                    {isLoading ? t.blooviAIPage.generating : t.blooviAIPage.generate}
                </ActionButton>
            </div>
            {isLoading && <Loader />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {result && (
                 <div className="mt-6 text-center">
                    <h3 className="font-bold mb-2">{t.blooviAIPage.result}</h3>
                    <div className="p-4 bg-gray-700/50 rounded-lg inline-block">
                        <img src={result} alt="Generated Logo" className="w-48 h-48 object-contain" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' x=\'0\' y=\'0\' fill=\'%23888\'/%3E%3Crect width=\'10\' height=\'10\' x=\'10\' y=\'10\' fill=\'%23888\'/%3E%3C/svg%3E")'}}/>
                    </div>
                     <a href={result} download={`${companyName}-logo.png`} className="block w-full text-center mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-500 transition-colors">{t.blooviAIPage.download}</a>
                </div>
            )}
        </div>
    );
};

const VoiceGenerator: React.FC = () => {
    const { t } = useLanguage();
    const [text, setText] = useState('');
    const [voice, setVoice] = useState('female');
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const audioContextRef = useRef<AudioContext | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setAudioUrl('');
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice === 'female' ? 'Kore' : 'Fenrir' } },
                    },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const audioBytes = b64decode(base64Audio);
                const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);
                const wavBlob = bufferToWav(audioBuffer);
                const url = URL.createObjectURL(wavBlob);
                setAudioUrl(url);
            } else {
                 throw new Error("No audio was generated.");
            }
        } catch (err) {
            console.error(err);
            setError(t.blooviAIPage.error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <textarea placeholder={t.blooviAIPage.enterText} rows={5} onChange={(e) => setText(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3"></textarea>
            <fieldset className="mt-4">
                <legend className="text-sm font-medium text-gray-300 mb-2">{t.blooviAIPage.selectVoice}</legend>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2"><input type="radio" name="voice" value="female" checked={voice === 'female'} onChange={(e) => setVoice(e.target.value)} className="form-radio text-lime-400 bg-gray-700 border-gray-600 focus:ring-lime-400"/> {t.blooviAIPage.female}</label>
                    <label className="flex items-center gap-2"><input type="radio" name="voice" value="male" checked={voice === 'male'} onChange={(e) => setVoice(e.target.value)} className="form-radio text-lime-400 bg-gray-700 border-gray-600 focus:ring-lime-400"/> {t.blooviAIPage.male}</label>
                </div>
            </fieldset>
            <div className="mt-6">
                <ActionButton onClick={handleGenerate} disabled={!text || isLoading}>
                     {isLoading ? t.blooviAIPage.generating : t.blooviAIPage.generate}
                </ActionButton>
            </div>
            {isLoading && <Loader />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {audioUrl && (
                 <div className="mt-6 text-center">
                    <h3 className="font-bold mb-2">{t.blooviAIPage.result}</h3>
                    <audio controls src={audioUrl} className="w-full"></audio>
                    <a href={audioUrl} download="promotional-voiceover.wav" className="block w-full text-center mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-500 transition-colors">{t.blooviAIPage.download}</a>
                </div>
            )}
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
            });
            const base64Image = response.generatedImages[0]?.image.imageBytes;
            if (base64Image) {
                setResult(`data:image/jpeg;base64,${base64Image}`);
            } else {
                throw new Error("No image was generated.");
            }
        } catch (err) {
            console.error(err);
            setError(t.blooviAIPage.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <textarea placeholder={t.blooviAIPage.imagePrompt} rows={4} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3"></textarea>
            <div className="mt-6">
                <ActionButton onClick={handleGenerate} disabled={!prompt || isLoading}>
                    {isLoading ? t.blooviAIPage.generating : t.blooviAIPage.generate}
                </ActionButton>
            </div>
            {isLoading && <Loader />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {result && (
                 <div className="mt-6 text-center">
                    <h3 className="font-bold mb-2">{t.blooviAIPage.result}</h3>
                     <div className="p-4 bg-gray-700/50 rounded-lg inline-block">
                        <img src={result} alt="Generated" className="max-w-full h-auto max-h-80"/>
                    </div>
                    <a href={result} download="generated-image.jpg" className="block w-full text-center mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-500 transition-colors">{t.blooviAIPage.download}</a>
                </div>
            )}
        </div>
    );
};

// --- Main Page Component ---

const BlooviAIPage: React.FC<BlooviAIPageProps> = ({ setPage }) => {
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const toolConfig = {
        bgRemover: { component: <BackgroundRemover />, title: t.blooviAIPage.tools.bgRemover.title },
        emailWriter: { component: <EmailWriter />, title: t.blooviAIPage.tools.emailWriter.title },
        imageEnhancer: { component: <ImageEnhancer />, title: t.blooviAIPage.tools.imageEnhancer.title },
        logoGenerator: { component: <LogoGenerator />, title: t.blooviAIPage.tools.logoGenerator.title },
        voiceGenerator: { component: <VoiceGenerator />, title: t.blooviAIPage.tools.voiceGenerator.title },
        imageGenerator: { component: <ImageGenerator />, title: t.blooviAIPage.tools.imageGenerator.title },
    };

    const tools = Object.keys(t.blooviAIPage.tools).map(key => ({
        id: key,
        ...t.blooviAIPage.tools[key as keyof typeof t.blooviAIPage.tools]
    }));
    
    const handleLaunchTool = (toolId: string) => {
        if (currentUser) {
            setActiveTool(toolId);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return (
        <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold">{t.blooviAIPage.title}</h1>
                    <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{t.blooviAIPage.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool) => (
                        <div key={tool.id} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-lime-400 transition-all duration-300 transform hover:-translate-y-2 flex flex-col text-center">
                            <div className="text-5xl mb-6">{tool.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-3 flex-grow">{tool.title}</h3>
                            <p className="text-gray-400 mb-6">{tool.description}</p>
                            <button onClick={() => handleLaunchTool(tool.id)} className="mt-auto bg-gray-700 text-white font-bold py-2 px-6 rounded-full hover:bg-lime-400 hover:text-gray-900 transition-colors">
                                {tool.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                isOpen={!!activeTool}
                onClose={() => setActiveTool(null)}
                title={activeTool ? toolConfig[activeTool as keyof typeof toolConfig].title : ''}
            >
                {activeTool && toolConfig[activeTool as keyof typeof toolConfig].component}
            </Modal>
            <Modal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              title={t.blooviAIPage.loginRequiredTitle}
            >
              <div className="text-center">
                <p className="text-gray-300 mb-8 text-lg">{t.blooviAIPage.loginRequiredMessage}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => { setIsLoginModalOpen(false); setPage('login'); }} 
                    className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-full text-base hover:bg-gray-500 transition-all"
                  >
                    {t.nav.login}
                  </button>
                  <button 
                     onClick={() => { setIsLoginModalOpen(false); setPage('signup'); }}
                     className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-4 rounded-full text-base hover:bg-lime-300 transition-all"
                  >
                    {t.nav.signup}
                  </button>
                </div>
              </div>
            </Modal>
        </div>
    );
};

export default BlooviAIPage;