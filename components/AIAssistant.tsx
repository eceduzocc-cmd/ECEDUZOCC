
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, Trash2, Bot, User, Loader2, Zap, ArrowRight, BookOpen } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: 'Hola Dra. Silva. El motor de IA de la Escuela de Educación está listo. ¿Deseas que redactemos un comunicado oficial o analicemos el desempeño del semestre?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await geminiService.askEducationalAssistant(input);
      const modelMessage: Message = { role: 'model', content: result, timestamp: new Date() };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Redactar acta de consejo académico",
    "Analizar política de becas 2024",
    "Sugerencias para mejora pedagógica"
  ];

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col max-w-5xl mx-auto animate-in fade-in slide-in-from-right-10 duration-700">
      {/* Header flotante */}
      <div className="mesh-gradient p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden mb-6">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 opacity-10 animate-pulse">
            <BrainCircuit size={200} />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-[28px] backdrop-blur-md shadow-xl border border-white/30">
              <Sparkles className="text-yellow-200 animate-pulse" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-brand font-black tracking-tighter uppercase mb-1">Centro de Inteligencia</h1>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                 <p className="text-indigo-100 text-xs font-bold tracking-widest uppercase opacity-80">Online • Gemini 3 Vision/Text Engine</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all group"
            title="Limpiar"
          >
            <Trash2 size={22} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Area de chat con scroll suave */}
      <div className="flex-1 bg-white/40 backdrop-blur-md border border-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto p-10 space-y-10" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
              <div className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'mesh-gradient text-white'
                }`}>
                  {msg.role === 'user' ? <User size={22} /> : <Bot size={22} />}
                </div>
                <div className={`p-6 rounded-[32px] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-medium'
                }`}>
                  {msg.content.split('\n').map((line, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{line}</p>
                  ))}
                  <div className="flex items-center justify-end gap-2 mt-4 opacity-40">
                    <span className="text-[10px] font-bold">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'model' && <Zap size={10} className="text-indigo-500" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-5 items-center">
                <div className="h-12 w-12 rounded-2xl mesh-gradient text-white flex items-center justify-center shadow-lg">
                  <Bot size={22} />
                </div>
                <div className="bg-white/50 p-6 rounded-[32px] rounded-tl-none border border-slate-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area premium */}
        <div className="p-8 border-t border-slate-100 bg-white/60 backdrop-blur-md">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {suggestions.map((text, idx) => (
                <button 
                  key={idx}
                  onClick={() => setInput(text)}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100 flex items-center gap-2"
                >
                  <BookOpen size={14} /> {text}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 bg-white p-3 pl-6 rounded-3xl shadow-xl border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
            <textarea 
              rows={1}
              placeholder="Escribe tu consulta administrativa aquí..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 font-medium resize-none py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-4 mesh-gradient text-white rounded-2xl hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-xl shadow-indigo-500/20 flex items-center gap-2 group"
            >
              <span className="hidden md:block text-xs font-black uppercase tracking-widest">Consultar</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
