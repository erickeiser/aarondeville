
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { useContent } from '../hooks/useContent';
import { PaperAirplaneIcon, SparklesIcon, CogIcon } from './Icons';
import { AboutContent, ServicesContent, ContactContent } from '../types';

const Chatbot: React.FC = () => {
  const { content } = useContent();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hi! I'm Ari's AI assistant. How can I help you with your fitness journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        const aistudio = (window as any).aistudio;
        if (aistudio && aistudio.hasSelectedApiKey) {
          const hasKey = await aistudio.hasSelectedApiKey();
          if (hasKey) {
            setApiKeyReady(true);
          }
        } else {
          // Fallback for environments where process.env is already populated
          if (process.env.API_KEY) {
            setApiKeyReady(true);
          }
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      }
    };
    checkKey();
  }, []);

  // Initialize Gemini Chat Session when API Key is ready
  useEffect(() => {
    if (!apiKeyReady) return;

    const initChat = async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.error("API_KEY is missing despite check.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      // Extract and cast section content for system instructions
      const aboutSection = content.sections.find(s => s.type === 'about');
      const aboutContent = aboutSection ? (aboutSection.content as AboutContent) : null;

      const servicesSection = content.sections.find(s => s.type === 'services');
      const servicesContent = servicesSection ? (servicesSection.content as ServicesContent) : null;

      const contactSection = content.sections.find(s => s.type === 'contact');
      const contactContent = contactSection ? (contactSection.content as ContactContent) : null;

      // Construct system instruction from site content
      const systemInstruction = `
        You are a friendly and professional AI assistant for Ari Deville Fitness.
        Your goal is to answer potential clients' questions, encourage them to sign up for services, and provide information about Ari Deville.

        Use the following website content to answer questions:
        
        Site Name: ${content.header.siteName}
        
        About Ari:
        ${aboutContent?.paragraph1 || ''}
        ${aboutContent?.paragraph2 || ''}
        
        Services & Pricing:
        ${(servicesContent?.plans || []).map((p: any) => `- ${p.title}: ${p.price}. ${p.description}`).join('\n')}
        
        Contact Info:
        Email: ${contactContent?.details?.email?.address || ''}
        Phone: ${contactContent?.details?.phone?.number || ''}
        Location: ${contactContent?.details?.location?.address || ''}
        Availability: ${contactContent?.details?.availability?.join(', ') || ''}

        Rules:
        - Keep answers concise, helpful, and encouraging.
        - If you don't know an answer based on the info above, suggest they use the contact form or email directly.
        - Do not make up prices or services not listed here.
        - Always be polite and professional.
      `;

      try {
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction,
          },
        });
      } catch (error) {
        console.error("Failed to create chat session:", error);
      }
    };

    initChat();
  }, [content, apiKeyReady]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEnableKey = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        await aistudio.openSelectKey();
        // Race condition mitigation: assume success after opening dialog
        setApiKeyReady(true);
      }
    } catch (e) {
      console.error("Error opening key selector:", e);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a placeholder for the model's response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      
      let fullText = '';
      for await (const chunk of resultStream) {
        const textChunk = chunk.text || '';
        fullText += textChunk;
        
        // Update the last message with accumulated text
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullText };
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Handle "Requested entity was not found" (Invalid Key)
      if (error.message && error.message.includes("Requested entity was not found")) {
          setApiKeyReady(false); // Reset state to force re-selection
          setMessages(prev => [...prev, { role: 'model', text: "It looks like there's an issue with the API Key. Please re-select your key." }]);
      } else {
          setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Please try again later or use the contact form." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKeyReady) {
      return (
        <div className="h-[500px] flex flex-col items-center justify-center bg-[#2B2B2B] rounded-lg border border-gray-700 text-center p-6">
            <div className="bg-[#1A1A1A] p-4 rounded-full mb-4">
                <SparklesIcon className="h-10 w-10 text-[#8C1E1E]" />
            </div>
            <h3 className="text-[#E8E6DC] font-bold text-xl mb-2">Enable AI Assistant</h3>
            <p className="text-[#E8E6DC]/70 mb-8 text-sm max-w-xs">
                To chat with the AI assistant, you need to connect your Google API Key.
            </p>
            <button 
                onClick={handleEnableKey}
                className="bg-[#8C1E1E] text-[#E8E6DC] px-6 py-3 rounded-lg font-semibold hover:bg-[#7a1a1a] transition-colors flex items-center gap-2 shadow-lg"
            >
                <CogIcon className="h-5 w-5" /> Connect API Key
            </button>
             <div className="mt-6 text-xs text-gray-500">
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-[#E8E6DC] transition-colors">
                    Billing Information
                </a>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-[#2B2B2B] rounded-lg border border-gray-700 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-[#8C1E1E] text-[#E8E6DC] rounded-br-none' 
                : 'bg-[#1A1A1A] text-[#E8E6DC] rounded-bl-none border border-gray-700'
            }`}>
              {msg.role === 'model' && idx === 0 ? (
                 <div className="flex items-center gap-2 mb-1 text-[#8C1E1E] font-bold text-xs uppercase tracking-wider">
                    <SparklesIcon className="h-3 w-3" /> AI Assistant
                 </div>
              ) : null}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about training, pricing, or availability..."
          className="w-full bg-[#2B2B2B] border border-gray-600 rounded-lg pl-4 pr-12 py-3 text-[#E8E6DC] focus:ring-[#8C1E1E] focus:border-[#8C1E1E] placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C1E1E] hover:text-[#a92626] p-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
      <p className="text-center text-xs text-gray-500 mt-2">
        Powered by Gemini 3 Pro. AI can make mistakes.
      </p>
    </div>
  );
};

export default Chatbot;
