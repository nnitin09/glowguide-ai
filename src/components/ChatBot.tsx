import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, ArrowLeft, Loader2, User, Sparkles } from 'lucide-react';
import { chatWithBeautyBot, ChatMessage } from '../services/gemini';
import Markdown from 'react-markdown';

const SUGGESTIONS = [
  "What is the best makeup routine for oily skin?",
  "How do I find my foundation shade?",
  "Suggest a subtle everyday makeup look.",
  "Best skincare ingredients for glowing skin?"
];

export function ChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your GlowGuide AI beauty expert. If you prefer not to upload a photo, we can chat! Tell me about your skin type, undertone, or what kind of makeup/skincare recommendations you're looking for." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (messageText?: string) => {
    const textToSend = typeof messageText === 'string' ? messageText : input;
    if (!textToSend.trim()) return;
    
    const userMessage: ChatMessage = { role: 'user', text: textToSend.trim() };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    if (!messageText) setInput('');
    setIsTyping(true);

    try {
      // Send all history except the one we just added (which is passed as newMessage)
      const reply = await chatWithBeautyBot(messages, userMessage.text);
      setMessages([...currentMessages, { role: 'model', text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...currentMessages, { role: 'model', text: "I'm sorry, I ran into an error processing your request. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-[32px] border border-white/50 shadow-2xl overflow-hidden flex flex-col h-[70vh] min-h-[500px] text-brand-ink">
      <div className="flex items-center justify-between p-6 border-b border-brand-ink/10 bg-white/50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-brand-rose/20 rounded-full transition-colors text-brand-ink/60 hover:text-brand-ink">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h2 className="serif text-2xl font-medium">Beauty Consult</h2>
            <span className="text-xs uppercase tracking-widest text-brand-ink/60 font-bold">GlowGuide AI</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-10 h-10 rounded-full bg-brand-ink text-brand-cream flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles size={18} />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-[24px] p-5 ${
              msg.role === 'user' 
                ? 'bg-brand-ink text-brand-cream rounded-tr-sm shadow-lg' 
                : 'bg-white rounded-tl-sm shadow-md'
            }`}>
              <div className={`prose-custom max-w-none text-sm md:text-base ${msg.role === 'user' ? 'text-brand-cream' : 'text-brand-ink/90'} leading-relaxed`}>
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-white text-brand-ink flex items-center justify-center shrink-0 shadow-md">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="w-10 h-10 rounded-full bg-brand-ink text-brand-cream flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles size={18} />
            </div>
            <div className="bg-white rounded-[24px] rounded-tl-sm p-5 shadow-md flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-brand-ink/60" />
              <span className="text-sm text-brand-ink/60 italic font-medium">Curating advice...</span>
            </div>
          </div>
        )}
        
        {messages.length === 1 && !isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 pt-4 justify-center"
          >
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="px-5 py-3 bg-white hover:bg-brand-ink text-brand-ink hover:text-brand-cream border shadow-sm border-brand-ink/20 rounded-full text-sm font-medium transition-all"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-6 bg-white/50 border-t border-brand-ink/10">
        <form 
          className="relative max-w-3xl mx-auto"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Ask a beauty question..."
            className="w-full bg-white border-2 border-transparent focus:border-brand-ink/20 focus:outline-none rounded-full py-4 pl-6 pr-16 shadow-lg transition-all text-brand-ink placeholder:text-brand-ink/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-ink text-brand-cream rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md"
          >
            <Send size={18} className="translate-x-[1px]" />
          </button>
        </form>
      </div>
    </div>
  );
}
