
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  BrainCircuit, 
  CalendarCheck, 
  AlertTriangle,
  Zap,
  TrendingUp,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { UserProfile, LeaveBalance, Holiday, LeaveRequest } from '../../types';
import { getAIAssistantResponse, analyzeLeavePatterns } from '../../services/gemini';
import { format } from 'date-fns';

interface AIAssistantProps {
  user: UserProfile;
  balance: LeaveBalance;
  holidays: Holiday[];
  history: LeaveRequest[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ user, balance, holidays, history }) => {
  const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([
    { role: 'bot', text: `Hello ${user.name}! I'm your LeaveGenie Assistant. You can ask me about your leave balances, upcoming holidays, or even for advice on when to take your next break.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<{ burnoutRisk: string, suggestions: string[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runAnalysis = async () => {
      const result = await analyzeLeavePatterns({ history, holidays, balance });
      setAnalysis(result);
      setIsAnalyzing(false);
    };
    runAnalysis();
  }, [history, holidays, balance]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getAIAssistantResponse(userMsg, { balance, holidays, history, user });
    
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
  };

  const getBurnoutColor = (risk: string) => {
    switch(risk) {
      case 'HIGH': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Chat Interface */}
      <div className="lg:col-span-2 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Genie AI Chat</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Always active • Context Aware</p>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 rounded-tr-none' 
                  : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/30">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative"
          >
            <input 
              type="text"
              placeholder="Ask about your balance, holidays, or taking a break..."
              className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all shadow-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:grayscale"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "How many CL leaves do I have?",
              "Next long weekend?",
              "Am I working too hard?",
              "Suggest a break"
            ].map(suggest => (
              <button 
                key={suggest}
                onClick={() => setInput(suggest)}
                className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
              >
                {suggest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Sidebar */}
      <div className="space-y-6">
        {/* Burnout Detection */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" size={20} /> Mental Health
            </h3>
          </div>
          
          {isAnalyzing ? (
            <div className="flex flex-col items-center py-8 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing patterns...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-3 ${getBurnoutColor(analysis?.burnoutRisk || 'LOW')}`}>
                <AlertTriangle size={32} />
                <div>
                  <p className="text-2xl font-black">{analysis?.burnoutRisk} RISK</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Burnout Probability</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium text-center italic">
                {analysis?.burnoutRisk === 'HIGH' 
                  ? "It's been a long time since your last break. Your focus and well-being might be suffering."
                  : analysis?.burnoutRisk === 'MEDIUM'
                  ? "You're doing okay, but a short break could really recharge your productivity."
                  : "Your work-life balance looks great! Keep managing your leaves effectively."}
              </p>
            </div>
          )}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-all"></div>
        </div>

        {/* Smart Suggestions */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Zap size={20} fill="currentColor" /> Smart Leave Hacks
          </h3>
          
          <div className="space-y-3">
            {isAnalyzing ? (
              <div className="py-10 space-y-4">
                <div className="w-full h-8 bg-white/5 rounded-xl animate-pulse"></div>
                <div className="w-full h-8 bg-white/5 rounded-xl animate-pulse [animation-delay:0.2s]"></div>
              </div>
            ) : analysis?.suggestions && analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((suggestion, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-all cursor-default group/item">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                    <TrendingUp size={16} />
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-10 text-center space-y-4">
                <CalendarCheck className="mx-auto text-slate-700" size={48} />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No optimal leave patterns detected currently.</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => handleSend()}
            className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
          >
            Apply Suggestions <ArrowRight size={14} />
          </button>
          
          <div className="absolute top-0 right-0 p-4 text-blue-500/10"><Sparkles size={80} /></div>
        </div>
      </div>
    </div>
  );
};
