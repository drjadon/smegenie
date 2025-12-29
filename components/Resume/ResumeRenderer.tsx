
import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ResumeRendererProps {
  data: ResumeData;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, templateId } = data;

  const renderPhoto = (className: string = "w-32 h-32 rounded-2xl border-4 border-white shadow-lg") => {
    if (!personalInfo.photo) return null;
    return <img src={personalInfo.photo} className={`${className} object-cover`} alt="Profile" />;
  };

  const renderHeader = () => {
    switch(templateId) {
      case 'gradient':
        return (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1"><Mail size={14} /> {personalInfo.email}</span>
                <span className="flex items-center gap-1"><Phone size={14} /> {personalInfo.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {personalInfo.location}</span>
              </div>
            </div>
            {renderPhoto("w-32 h-32 rounded-3xl border-4 border-white/20 shadow-2xl")}
          </div>
        );
      case 'elegant':
        return (
          <div className="text-center p-12 border-b-2 border-slate-900 mb-8 relative">
            <div className="mb-6 flex justify-center">
              {renderPhoto("w-32 h-40 rounded-sm border border-slate-200 grayscale shadow-md")}
            </div>
            <h1 className="text-5xl font-serif mb-4 italic">{personalInfo.fullName || 'Your Name'}</h1>
            <div className="flex justify-center gap-6 text-sm font-medium italic">
               <span>{personalInfo.email}</span>
               <span>•</span>
               <span>{personalInfo.phone}</span>
               <span>•</span>
               <span>{personalInfo.location}</span>
            </div>
          </div>
        );
      case 'tech':
        return (
          <div className="p-10 border-b border-slate-100 flex items-center gap-8 bg-blue-50/30">
            {renderPhoto("w-32 h-32 rounded-full border-4 border-blue-600 shadow-xl ring-8 ring-blue-50")}
            <div className="flex-1">
              <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1 text-blue-600"><Mail size={12} /> {personalInfo.email}</span>
                <span className="flex items-center gap-1 text-indigo-600"><Phone size={12} /> {personalInfo.phone}</span>
                <span className="flex items-center gap-1 text-slate-600"><MapPin size={12} /> {personalInfo.location}</span>
              </div>
            </div>
          </div>
        );
      case 'academic':
        return (
          <div className="p-12 border-b-4 border-emerald-600 flex justify-between items-start bg-emerald-50/20">
            <div className="max-w-md">
              <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <div className="space-y-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <p className="flex items-center gap-2"><Mail size={14} className="text-emerald-600" /> {personalInfo.email}</p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-emerald-600" /> {personalInfo.phone}</p>
                <p className="flex items-center gap-2"><MapPin size={14} className="text-emerald-600" /> {personalInfo.location}</p>
              </div>
            </div>
            {renderPhoto("w-28 h-36 rounded-xl border-4 border-white shadow-xl")}
          </div>
        );
      case 'compact':
        return (
          <div className="p-8 border-b border-slate-100 flex items-center gap-6">
            {renderPhoto("w-20 h-20 rounded-xl border border-slate-200 shadow-sm")}
            <div className="flex-1 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900 leading-none">{personalInfo.fullName}</h1>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Professional Portfolio</p>
              </div>
              <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest space-y-1">
                <p>{personalInfo.email}</p>
                <p>{personalInfo.phone}</p>
                <p>{personalInfo.location}</p>
              </div>
            </div>
          </div>
        );
      case 'darkside':
      case 'sidebar':
        return null; // Sidebars handled separately
      default:
        return (
          <div className="p-10 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <div className="grid grid-cols-1 gap-y-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email || 'email@example.com'}</span>
                <span className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone || '+1 234 567 890'}</span>
                <span className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.location || 'Location'}</span>
                {personalInfo.website && <span className="flex items-center gap-2"><Globe size={14} /> {personalInfo.website}</span>}
              </div>
            </div>
            {renderPhoto("w-32 h-32 rounded-2xl border-4 border-slate-50 shadow-md")}
          </div>
        );
    }
  };

  const renderSectionHeader = (title: string) => {
    const base = "text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3";
    switch(templateId) {
      case 'academic':
        return <h3 className={base + " text-emerald-600"}><div className="w-8 h-0.5 bg-emerald-600"></div> {title}</h3>;
      case 'elegant':
        return <h3 className="text-lg font-serif italic border-b border-slate-200 mb-4 pb-1">{title}</h3>;
      default:
        return <h3 className={base + " text-blue-600"}>{title} <div className="flex-1 h-px bg-slate-100"></div></h3>;
    }
  };

  const Content = () => (
    <div className="space-y-8">
      {personalInfo.summary && (
        <section>
          {renderSectionHeader('Profile Summary')}
          <p className="text-sm text-slate-600 leading-relaxed italic">{personalInfo.summary}</p>
        </section>
      )}

      <section>
        {renderSectionHeader('Professional Experience')}
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <div key={i} className="relative pl-4 border-l-2 border-slate-50">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-black text-slate-900 text-sm">{exp.company}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">{exp.position}</p>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
          {experience.length === 0 && <p className="text-xs text-slate-400 italic">No experience added yet.</p>}
        </div>
      </section>

      <section>
        {renderSectionHeader('Education')}
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{edu.graduationDate}</span>
              </div>
              <p className="text-xs text-slate-500">{edu.school}</p>
            </div>
          ))}
          {education.length === 0 && <p className="text-xs text-slate-400 italic">No education added yet.</p>}
        </div>
      </section>
    </div>
  );

  // Fix: changed function signature to accept a props object for SkillsList sub-component
  const SkillsList = ({ isSidebar = false }: { isSidebar?: boolean }) => (
    <section>
      {renderSectionHeader('Technical Expertise')}
      <div className={`flex flex-wrap gap-2 ${isSidebar ? 'flex-col' : ''}`}>
        {skills.map(s => (
          <span key={s} className={`bg-slate-50 border border-slate-100 px-3 py-1 rounded text-[10px] font-black text-slate-700 uppercase tracking-widest ${isSidebar ? 'w-full' : ''}`}>
            {s}
          </span>
        ))}
      </div>
    </section>
  );

  const Layouts = {
    sidebar: (
      <div className="bg-white min-h-[1100px] shadow-2xl flex">
        <div className="w-1/3 bg-indigo-50 p-10 flex flex-col gap-10">
           <div className="text-center">
              <div className="mx-auto mb-6">
                {personalInfo.photo ? (
                  renderPhoto("w-32 h-32 rounded-3xl mx-auto shadow-xl border-4 border-white")
                ) : (
                  <div className="w-24 h-24 bg-indigo-200 rounded-3xl mx-auto flex items-center justify-center text-indigo-600 font-black text-3xl">
                    {personalInfo.fullName?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <h1 className="text-xl font-black text-indigo-900 leading-tight mb-2 uppercase tracking-tighter">{personalInfo.fullName}</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Candidate Portfolio</p>
           </div>
           
           <div className="space-y-4 text-xs">
              <p className="flex items-center gap-2 text-indigo-700 font-bold"><Mail size={14} /> {personalInfo.email}</p>
              <p className="flex items-center gap-2 text-indigo-700 font-bold"><Phone size={14} /> {personalInfo.phone}</p>
              <p className="flex items-center gap-2 text-indigo-700 font-bold"><MapPin size={14} /> {personalInfo.location}</p>
           </div>

           <SkillsList isSidebar={true} />
        </div>
        <div className="flex-1 p-12">
          <Content />
        </div>
      </div>
    ),
    darkside: (
      <div className="bg-white min-h-[1100px] shadow-2xl flex">
        <div className="w-[300px] bg-slate-900 p-10 text-white flex flex-col gap-8">
           <div className="mb-6">
              {renderPhoto("w-full aspect-[4/5] rounded-2xl grayscale object-cover border-2 border-white/10")}
           </div>
           <h1 className="text-3xl font-black tracking-tighter uppercase mb-4 leading-none">{personalInfo.fullName}</h1>
           <div className="space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <p className="flex flex-col gap-1"><span className="text-blue-400">Email</span> {personalInfo.email}</p>
              <p className="flex flex-col gap-1"><span className="text-blue-400">Phone</span> {personalInfo.phone}</p>
              <p className="flex flex-col gap-1"><span className="text-blue-400">Location</span> {personalInfo.location}</p>
           </div>
           <SkillsList isSidebar={true} />
        </div>
        <div className="flex-1 p-12">
           <Content />
        </div>
      </div>
    ),
    default: (
      <div className="bg-white min-h-[1100px] shadow-2xl overflow-hidden">
        {renderHeader()}
        <div className="p-12 space-y-10">
          <Content />
          <SkillsList />
        </div>
      </div>
    )
  };

  return Layouts[templateId as keyof typeof Layouts] || Layouts.default;
};
