
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  Settings, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  LayoutTemplate, 
  Lock,
  ChevronRight,
  ChevronDown,
  Camera,
  X,
  Crown
} from 'lucide-react';
import { ResumeData, PlanType } from '../../types';
import { exportToPDF } from '../../services/export';
import { ResumeRenderer } from './ResumeRenderer';

interface ResumeMakerProps {
  plan: PlanType;
  data: ResumeData;
  onSave: (data: ResumeData) => void;
  onNavigateToPlans: () => void;
}

const TEMPLATES = [
  { id: 'modern', name: 'Modern Minimalist', preview: 'bg-white' },
  { id: 'executive', name: 'Executive Professional', preview: 'bg-slate-50' },
  { id: 'sidebar', name: 'Modern Sidebar', preview: 'bg-indigo-50' }, // Moved sidebar to top 3
  { id: 'tech', name: 'Creative Tech', preview: 'bg-blue-50' },
  { id: 'compact', name: 'Compact One-Pager', preview: 'bg-slate-100' },
  { id: 'elegant', name: 'Elegant Serif', preview: 'bg-orange-50' },
  { id: 'bordered', name: 'Bordered Clean', preview: 'bg-white' },
  { id: 'gradient', name: 'Gradient Top', preview: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  { id: 'darkside', name: 'Dark Sidebar', preview: 'bg-slate-900' },
  { id: 'academic', name: 'Academic Clean', preview: 'bg-emerald-50' },
];

export const ResumeMaker: React.FC<ResumeMakerProps> = ({ plan, data, onSave, onNavigateToPlans }) => {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [view, setView] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    onSave({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
  };

  const addExperience = () => {
    onSave({
      ...data,
      experience: [...data.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }]
    });
  };

  const removeExperience = (index: number) => {
    onSave({
      ...data,
      experience: data.experience.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = data.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp);
    onSave({ ...data, experience: updated });
  };

  const addEducation = () => {
    onSave({
      ...data,
      education: [...data.education, { school: '', degree: '', graduationDate: '' }]
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = data.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu);
    onSave({ ...data, education: updated });
  };

  const addSkill = (skill: string) => {
    if (!skill || data.skills.includes(skill)) return;
    onSave({ ...data, skills: [...data.skills, skill] });
  };

  const removeSkill = (skill: string) => {
    onSave({ ...data, skills: data.skills.filter(s => s !== skill) });
  };

  const handleTemplateSelect = (id: string, index: number) => {
    if (plan === 'FREE' && index >= 3) {
      alert("This template is part of LeaveGenie Pro. Upgrade to unlock all 10+ premium designs!");
      onNavigateToPlans();
      return;
    }
    onSave({ ...data, templateId: id });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Configuration Panel */}
      <div className={`xl:w-[450px] space-y-6 ${view === 'PREVIEW' ? 'hidden xl:block' : ''}`}>
        <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <LayoutTemplate className="text-blue-600" size={20} />
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Designs</h3>
            </div>
            {plan === 'FREE' && (
              <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-tighter flex items-center gap-1">
                <Crown size={10} /> 3 Free Templates
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {TEMPLATES.map((t, index) => {
              const isLocked = plan === 'FREE' && index >= 3;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTemplateSelect(t.id, index)}
                  title={isLocked ? `${t.name} (Pro Only)` : t.name}
                  className={`aspect-square rounded-xl border-2 transition-all overflow-hidden relative group ${
                    data.templateId === t.id ? 'border-blue-600 scale-110 shadow-lg' : 'border-slate-100'
                  } ${t.preview} ${isLocked ? 'grayscale opacity-70' : ''}`}
                >
                  {t.id === 'gradient' && <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600" />}
                  {t.id === 'darkside' && <div className="w-full h-full bg-slate-800" />}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <Lock size={12} className="text-slate-600" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {TEMPLATES.find(t => t.id === data.templateId)?.name} {plan === 'FREE' && TEMPLATES.findIndex(t => t.id === data.templateId) >= 3 && '(Locked Preview)'}
          </p>
        </div>

        {/* Section Accordions */}
        <div className="space-y-4">
          {/* Personal Info */}
          <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveSection(activeSection === 'personal' ? '' : 'personal')}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><User size={20} /></div>
                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Personal Details</span>
              </div>
              {activeSection === 'personal' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {activeSection === 'personal' && (
              <div className="p-6 border-t border-slate-100 space-y-6 bg-slate-50/30">
                <div className="flex flex-col items-center">
                  <div 
                    className="relative w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {data.personalInfo.photo ? (
                      <>
                        <img src={data.personalInfo.photo} className="w-full h-full object-cover" alt="Profile" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white" size={24} />
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                          className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Camera size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                  />
                  <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Passport size recommended</p>
                </div>

                <div className="space-y-4">
                  <input placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} />
                    <input placeholder="Phone" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} />
                  </div>
                  <input placeholder="Location (e.g. New York, NY)" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={data.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} />
                  <textarea placeholder="Professional Summary" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" value={data.personalInfo.summary} onChange={e => updatePersonalInfo('summary', e.target.value)} />
                </div>
              </div>
            )}
          </section>

          {/* Experience */}
          <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Briefcase size={20} /></div>
                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Work History</span>
              </div>
              {activeSection === 'experience' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {activeSection === 'experience' && (
              <div className="p-6 border-t border-slate-100 space-y-6 bg-slate-50/30">
                {data.experience.map((exp, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl relative group">
                    <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="space-y-3">
                      <input placeholder="Company Name" className="w-full border-none p-0 text-sm font-bold outline-none" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                      <input placeholder="Position" className="w-full border-none p-0 text-xs text-slate-500 outline-none" value={exp.position} onChange={e => updateExperience(i, 'position', e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Start Date" className="text-[10px] border border-slate-100 rounded px-2 py-1" value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} />
                        <input type="text" placeholder="End Date" className="text-[10px] border border-slate-100 rounded px-2 py-1" value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} />
                      </div>
                      <textarea placeholder="Bullet points of achievements..." className="w-full text-xs text-slate-600 border border-slate-100 rounded p-2 min-h-[80px] outline-none" value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center gap-2 hover:bg-white hover:border-blue-400 transition-all font-bold text-xs uppercase tracking-widest">
                  <Plus size={16} /> Add Experience
                </button>
              </div>
            )}
          </section>

          {/* Education */}
          <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveSection(activeSection === 'education' ? '' : 'education')}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><GraduationCap size={20} /></div>
                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Education</span>
              </div>
              {activeSection === 'education' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {activeSection === 'education' && (
              <div className="p-6 border-t border-slate-100 space-y-6 bg-slate-50/30">
                {data.education.map((edu, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl relative group">
                    <button onClick={() => onSave({...data, education: data.education.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="space-y-3">
                      <input placeholder="School/University" className="w-full border-none p-0 text-sm font-bold outline-none" value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} />
                      <input placeholder="Degree" className="w-full border-none p-0 text-xs text-slate-500 outline-none" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} />
                      <input type="text" placeholder="Graduation Date" className="text-[10px] border border-slate-100 rounded px-2 py-1" value={edu.graduationDate} onChange={e => updateEducation(i, 'graduationDate', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center gap-2 hover:bg-white hover:border-blue-400 transition-all font-bold text-xs uppercase tracking-widest">
                  <Plus size={16} /> Add Education
                </button>
              </div>
            )}
          </section>

          {/* Skills */}
          <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Wrench size={20} /></div>
                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Expertise & Skills</span>
              </div>
              {activeSection === 'skills' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {activeSection === 'skills' && (
              <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/30">
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.skills.map(s => (
                    <span key={s} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                      {s} <button onClick={() => removeSkill(s)} className="hover:text-red-500"><Plus size={12} className="rotate-45" /></button>
                    </span>
                  ))}
                </div>
                <input 
                  placeholder="Type skill and press Enter" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-4 flex items-center justify-between shadow-sm sticky top-24 z-20">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setView('EDIT')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'EDIT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Edit</button>
             <button onClick={() => setView('PREVIEW')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'PREVIEW' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Preview</button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => exportToPDF('resume-canvas', `Resume_${data.personalInfo.fullName.replace(/\s+/g, '_')}`)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] flex items-center gap-2 uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-slate-200/50 p-6 md:p-12 rounded-[3rem] min-h-[1000px] flex justify-center overflow-auto">
          <div id="resume-canvas" className="w-full max-w-[800px] min-w-[700px]">
            <ResumeRenderer data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};
