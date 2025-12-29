
import React, { useState, useMemo } from 'react';
// Added BriefcaseBusiness to the imports from lucide-react
import { Calendar, Type, MessageSquare, Wand2, Loader2, AlertCircle, Building2, PenTool, ChevronDown, Sparkles, Languages, BrainCircuit, ShieldCheck, FileText, School, BriefcaseBusiness } from 'lucide-react';
import { LEAVE_TYPES, REASON_TEMPLATES, TYPE_MAPPING, AI_TONES } from '../constants';
import { LeaveRequest, PlanType, LeaveBalance, EmployerProfile, UserProfile } from '../types';
import { differenceInDays, parseISO, isAfter } from 'date-fns';
import { polishReason, composeReason } from '../services/gemini';

interface LeaveRequestFormProps {
  onGenerate: (data: LeaveRequest) => void;
  plan: PlanType;
  balance: LeaveBalance;
  employers: EmployerProfile[];
  hasSignature: boolean;
  onNavigateToSignature: () => void;
  user: UserProfile;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ 
  onGenerate, plan, balance, employers, hasSignature, onNavigateToSignature, user
}) => {
  const isManaged = !!user.enterpriseId;
  const isStudentOrIntern = user.employeeType === 'STUDENT' || user.employeeType === 'INTERN';

  const filteredLeaveTypes = useMemo(() => {
    return LEAVE_TYPES.filter(type => {
      if (user.gender === 'MALE') {
        if (type === 'Maternity Leave' || type === 'Child Care Leave (CCL)') return false;
      } else if (user.gender === 'FEMALE') {
        if (type === 'Paternity Leave') return false;
      }
      
      // Academic filters
      if (user.employeeType === 'STUDENT') {
        if (['Earned Leave (EL)', 'Half Pay Leave (HPL)', 'Restricted Holiday (RH)', 'Child Care Leave (CCL)'].includes(type)) return false;
      } else {
        if (['Exam Leave (Academic)', 'Duty Leave (Academic)'].includes(type)) return false;
      }
      
      return true;
    });
  }, [user.gender, user.employeeType]);

  const [formData, setFormData] = React.useState<Partial<LeaveRequest>>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    leaveType: filteredLeaveTypes[0] || LEAVE_TYPES[0],
    reason: '',
    duration: 1,
    employerId: isManaged ? 'enterprise' : (employers[0]?.id || ''),
    documentType: isStudentOrIntern ? 'ACADEMIC' : 'PROFESSIONAL'
  });
  
  const [selectedTone, setSelectedTone] = useState('Standard');
  const [isPolishing, setIsPolishing] = React.useState(false);
  const [isComposing, setIsComposing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [keywords, setKeywords] = useState('');
  const [showAiCompose, setShowAiCompose] = useState(false);

  React.useEffect(() => {
    try {
      const start = parseISO(formData.startDate!);
      const end = parseISO(formData.endDate!);
      
      if (isAfter(start, end)) {
        setError("Start date cannot be after end date.");
        setFormData(prev => ({ ...prev, duration: 0 }));
        return;
      }

      const diff = differenceInDays(end, start) + 1;
      const duration = Math.max(0, diff);
      setFormData(prev => ({ ...prev, duration }));
      
      const typeKey = TYPE_MAPPING[formData.leaveType!] || 'other';
      const currentBal = balance[typeKey];
      
      if (typeKey !== 'other' && !isStudentOrIntern) {
        if (duration > currentBal) {
          setError(`Insufficient ${formData.leaveType} balance. Requested: ${duration}d, Available: ${currentBal}d.`);
        } else {
          setError(null);
        }
      } else {
        if (duration <= 0) {
          setError("Invalid duration selected.");
        } else {
          setError(null);
        }
      }
    } catch (e) {
      setError("Please check your date format.");
    }
  }, [formData.startDate, formData.endDate, formData.leaveType, balance, isStudentOrIntern]);

  const handleAiPolish = async () => {
    if (plan === 'FREE') {
      alert("AI Reason Polishing is a PRO feature. Upgrade to unlock!");
      return;
    }
    if (!formData.reason?.trim()) return;
    setIsPolishing(true);
    const polished = await polishReason(formData.reason, selectedTone);
    setFormData(prev => ({ ...prev, reason: polished }));
    setIsPolishing(false);
  };

  const handleAiCompose = async () => {
    if (plan === 'FREE') {
      alert("AI Compose is a PRO feature. Upgrade to unlock!");
      return;
    }
    if (!keywords.trim()) return;
    setIsComposing(true);
    const context = formData.documentType === 'ACADEMIC' ? 'Academic/Institutional' : 'Professional/Corporate';
    const composed = await composeReason(`${keywords} (${context} context)`, formData.leaveType || 'General');
    setFormData(prev => ({ ...prev, reason: composed }));
    setIsComposing(false);
    setShowAiCompose(false);
  };

  const handleGenerate = () => {
    if (error) return;
    if (!isManaged && !formData.employerId) {
      alert(`Please select a ${isStudentOrIntern ? 'Institution' : 'Employer'} first!`);
      return;
    }

    const selectedEmp = employers.find(e => e.id === formData.employerId);
    
    onGenerate({
      ...formData as LeaveRequest,
      id: Math.random().toString(36).substr(2, 9),
      applicantId: user.id,
      applicantName: user.name,
      employerName: isManaged ? 'Managed Institute' : (selectedEmp?.companyName || 'Institution'),
      timestamp: Date.now()
    });
  };

  const currentTypeKey = TYPE_MAPPING[formData.leaveType!] || 'other';
  const availableBal = balance[currentTypeKey];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Document Type Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
           <button 
             onClick={() => setFormData({...formData, documentType: 'PROFESSIONAL'})}
             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${formData.documentType === 'PROFESSIONAL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <BriefcaseBusiness size={14} /> Professional
           </button>
           <button 
             onClick={() => setFormData({...formData, documentType: 'ACADEMIC'})}
             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${formData.documentType === 'ACADEMIC' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <School size={14} /> Academic
           </button>
        </div>

        {!isManaged && (
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
              {formData.documentType === 'ACADEMIC' ? <School size={14} className="text-blue-500" /> : <Building2 size={14} className="text-blue-500" />} 
              Select {formData.documentType === 'ACADEMIC' ? 'Institution' : 'Employer'}
            </label>
            <div className="relative">
              <select
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                value={formData.employerId}
                onChange={(e) => setFormData({ ...formData, employerId: e.target.value })}
              >
                {employers.length === 0 && <option value="">No {formData.documentType === 'ACADEMIC' ? 'institutes' : 'employers'} saved</option>}
                {employers.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.companyName} ({emp.managerName})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" /> Start Date
            </label>
            <input
              type="date"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" /> End Date
            </label>
            <input
              type="date"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        {/* Duration & Error Feedback */}
        <div className={`text-center py-4 px-6 rounded-2xl transition-all border flex flex-col items-center gap-1 ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          <span className="text-sm font-black flex items-center justify-center gap-2 uppercase tracking-widest">
            {error && <AlertCircle size={18} />}
            Duration: {formData.duration} Day(s)
          </span>
          {error && <p className="text-[11px] font-bold mt-1 animate-pulse">{error}</p>}
        </div>

        {/* Leave Type & Balance Tracker */}
        <div>
          <div className="flex justify-between items-center mb-3 ml-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Type size={14} className="text-blue-500" /> Application Category
            </label>
            {!isStudentOrIntern && currentTypeKey !== 'other' && (
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${availableBal > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                Available: {availableBal}d
              </span>
            )}
          </div>
          <div className="relative">
            <select
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            >
              {filteredLeaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Reason Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-3 ml-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <MessageSquare size={14} className="text-blue-500" /> Details & Reason
            </label>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer appearance-none pr-8"
                >
                  {AI_TONES.map(tone => <option key={tone.id} value={tone.id}>{tone.label} Tone</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
              
              <button
                onClick={handleAiPolish}
                disabled={isPolishing || !formData.reason}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                  plan === 'FREE' ? 'bg-slate-100 text-slate-400 grayscale cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'
                }`}
              >
                {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                Polish {plan === 'FREE' && '🔒'}
              </button>
            </div>
          </div>

          {!showAiCompose ? (
            <button 
              onClick={() => plan === 'FREE' ? alert("AI Compose is a PRO feature.") : setShowAiCompose(true)}
              className="w-full py-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border-dashed"
            >
              <Sparkles size={14} /> Compose with AI Keywords
            </button>
          ) : (
            <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-[2rem] space-y-4 animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> Keywords to Reason
                  </span>
                  <button onClick={() => setShowAiCompose(false)} className="text-slate-400 hover:text-slate-600"><AlertCircle className="rotate-45" size={16} /></button>
               </div>
               <input 
                 autoFocus
                 placeholder="e.g. exams, preparation, library visit"
                 className="w-full bg-white border border-blue-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                 value={keywords}
                 onChange={e => setKeywords(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleAiCompose()}
               />
               <button 
                 onClick={handleAiCompose}
                 disabled={isComposing || !keywords}
                 className="w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
               >
                 {isComposing ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />}
                 Generate Reason
               </button>
            </div>
          )}
          
          <div className="relative group">
            {isPolishing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Sparkles className="text-indigo-600 animate-pulse" size={32} />
                    <div className="absolute -inset-2 bg-indigo-500/20 blur-xl rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">AI is thinking...</span>
                </div>
              </div>
            )}
            <textarea
              className={`w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px] font-medium text-slate-700 leading-relaxed transition-all placeholder:text-slate-300 ${isPolishing ? 'opacity-40' : ''}`}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Type your reason here or use the AI features above..."
            />
          </div>

          <div className="space-y-3">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Or Pick a Standard Template</p>
             <div className="flex flex-wrap gap-2">
                {REASON_TEMPLATES.map((tmpl, i) => (
                  <button
                    key={i}
                    onClick={() => setFormData({ ...formData, reason: tmpl.text })}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                  >
                    {tmpl.label}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Signature */}
        <div className="pt-8 border-t border-slate-100">
           <button 
             onClick={onNavigateToSignature}
             className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 border-dashed transition-all active:scale-[0.98] ${
               hasSignature ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-200'
             }`}
           >
             <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl ${hasSignature ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                 <PenTool size={24} />
               </div>
               <div className="text-left">
                 <p className="text-sm font-black uppercase tracking-widest">{hasSignature ? 'Signature Attached' : 'Attach Signature'}</p>
                 <p className="text-[10px] font-medium opacity-70 mt-0.5">{plan === 'FREE' ? 'Digital Sign is a PRO feature' : 'Included in your application'}</p>
               </div>
             </div>
             {hasSignature && <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>}
           </button>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!!error || (!isManaged && employers.length === 0)}
        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.25em] text-sm shadow-2xl hover:bg-slate-800 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-10"
      >
        Review & Generate Preview
      </button>
    </div>
  );
};
