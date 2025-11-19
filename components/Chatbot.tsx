
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { useContent } from '../hooks/useContent';
import { PaperAirplaneIcon, SparklesIcon } from './Icons';
import { AboutContent, ServicesContent, ContactContent } from '../types';

const Chatbot: React.FC = () => {
  const { content } = useContent();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hi! I'm Ari's AI assistant. How can I help you with your fitness journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize Gemini Chat Session
  useEffect(() => {
    const initChat = async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.error("API_KEY is missing in environment variables.");
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

      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction,
        },
      });
    };

    initChat();
  }, [content]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Please try again later or use the contact form." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-[#2B2B2B] rounded-lg border border-gray-700 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
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
