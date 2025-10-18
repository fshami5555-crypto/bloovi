import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'ai', text: t.chatbot.greeting }]);
    }
  }, [isOpen, t.chatbot.greeting, messages.length]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { sender: 'user' as const, text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are a friendly and helpful AI marketing assistant for 'Bloovi Media', a creative marketing agency. Your primary goal is to provide initial marketing advice and insights. It is crucial that you always guide the user towards seeking professional help from the human experts at Bloovi Media for comprehensive and personalized strategies. After providing helpful information, always conclude your response with a friendly encouragement to contact the Bloovi team. For example, say: 'For a strategy tailored specifically to your brand, our team of experts at Bloovi would be happy to help.' or 'This is a great starting point! To really dive deep and create a winning strategy, I'd recommend a chat with our specialists at Bloovi.'",
          },
        });
      }
      
      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      // FIX: Correctly access the 'text' property from the response object.
      const aiMessage = { sender: 'ai' as const, text: response.text };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage = { sender: 'ai' as const, text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-0 ${language === 'ar' ? 'left-8' : 'right-8'} transition-all duration-300 z-40 ${isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-lime-400 text-gray-900 rounded-full p-4 shadow-lg hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-75 transform hover:scale-110 transition-transform"
          aria-label={t.chatbot.tooltip}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div className={`fixed bottom-0 ${language === 'ar' ? 'left-0 sm:left-8' : 'right-0 sm:right-8'} w-full sm:max-w-md h-full sm:h-[70vh] sm:max-h-[600px] bg-gray-800 border-t-2 sm:border-2 border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col transition-transform duration-500 ease-in-out z-50 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold">{t.chatbot.title}</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-700 text-gray-200 rounded-bl-lg'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-gray-700 rounded-2xl rounded-bl-lg px-4 py-2 flex items-center space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chatbot.inputPlaceholder}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
              disabled={isLoading}
            />
            <button type="submit" className="bg-lime-400 text-gray-900 rounded-full p-3 hover:bg-lime-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors" disabled={isLoading || !inputValue.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${language === 'ar' ? 'transform -scale-x-100' : ''}`}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;