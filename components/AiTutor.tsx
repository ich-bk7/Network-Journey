import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { sendMessageToTutor } from '../services/geminiService';
import { ChatMessage } from '../types';
import SimpleMarkdown from './SimpleMarkdown';

interface AiTutorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiTutor: React.FC<AiTutorProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'model', text: 'Hi! I\'m your Net-Start AI Tutor. Ask me anything about networking, from "What is a subnet?" to "How do I configure OSPF on Cisco?".', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToTutor(messages, input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col h-[600px] max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot size={20} />
            </div>
            <div>
                <h3 className="font-bold">AI Network Tutor</h3>
                <p className="text-xs text-indigo-200">Powered by Gemini 2.5</p>
            </div>
        </div>
        <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.role === 'model' ? (
                 <div className="prose prose-sm prose-slate max-w-none">
                     <SimpleMarkdown>{msg.text}</SimpleMarkdown>
                 </div>
              ) : (
                  <p className="text-sm">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about routing, switching..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiTutor;