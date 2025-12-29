
import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Share2, Send, Calendar as CalendarIcon, Download, Printer, Layout, School, BriefcaseBusiness } from 'lucide-react';
import { UserProfile, EmployerProfile, LeaveRequest, PlanType } from '../types';
import { format } from 'date-fns';
import { exportToImage, exportToPDF } from '../services/export';
import { createGoogleCalendarUrl } from '../constants';

interface PreviewLetterProps {
  user: UserProfile;
  employer: EmployerProfile;
  request: LeaveRequest;
  plan: PlanType;
  signature?: string;
}

export const PreviewLetter: React.FC<PreviewLetterProps> = ({ user, employer, request, plan, signature }) => {
  const [docType, setDocType] = useState<'PROFESSIONAL' | 'ACADEMIC'>(request.documentType || 'PROFESSIONAL');
  const currentDate = format(new Date(), 'MMMM dd, yyyy');
  
  const isAcademic = docType === 'ACADEMIC';

  const handleShareEmail = () => {
    const subject = `Application - ${request.leaveType} - ${user.name}`;
    const body = `To ${employer.managerName},\n\nI am writing to formally request leave for ${request.duration} days from ${request.startDate} to ${request.endDate}.\n\nReason: ${request.reason}\n\nThank you for your consideration.\n\nSincerely,\n${user.name}\n${user.designation}`;
    window.location.href = `mailto:${employer.managerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleAddToCalendar = () => {
    const url = createGoogleCalendarUrl(
      `Leave: ${request.leaveType}`,
      request.startDate,
      request.endDate,
      `Reason: ${request.reason}\nEntity: ${employer.companyName}`
    );
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Letter Formatting Controls */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm no-print items-center justify-between">
         <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setDocType('PROFESSIONAL')}
             className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${!isAcademic ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
           >
             <BriefcaseBusiness size={14} /> Corporate
           </button>
           <button 
             onClick={() => setDocType('ACADEMIC')}
             className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isAcademic ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
           >
             <School size={14} /> Academic
           </button>
         </div>
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-4 italic">Document Layout Engine</p>
      </div>

      {/* Letter Visual - Simulating A4 Dimensions */}
      <div className="relative flex justify-center">
        <div 
          id="leave-letter"
          className="bg-white p-[25mm] letter-shadow border border-slate-200 rounded-sm w-full max-w-[210mm] min-h-[297mm] flex flex-col font-serif text-slate-900 leading-relaxed relative overflow-hidden text-[11pt]"
          style={{ fontFamily: "'Inter', 'Georgia', serif" }}
        >
          {plan === 'FREE' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.03] text-6xl font-black text-slate-900 whitespace-nowrap z-0">
              SMEGENIE FREE VERSION
            </div>
          )}

          {/* Date */}
          <div className="text-right mb-12 italic text-slate-500 z-10">
            {currentDate}
          </div>

          {/* Recipient */}
          <div className="mb-10 z-10 space-y-1">
            <p className="font-bold mb-2">To,</p>
            <p className="font-semibold">{isAcademic ? `The Principal / HOD,` : 'To,'}</p>
            <p className="font-semibold">{employer.managerName || (isAcademic ? '[Authority Name]' : '[Manager Name]')}</p>
            <p>{employer.companyName || (isAcademic ? '[Institution Name]' : '[Company Name]')}</p>
          </div>

          {/* Subject */}
          <div className="mb-8 z-10">
            <p className="font-bold underline">Subject: Application for {request.leaveType}</p>
          </div>

          {/* Salutation & Body */}
          <div className="flex-1 space-y-6 z-10 text-justify">
            <p>{isAcademic ? 'Respected Sir/Madam,' : `Dear ${employer.managerName || 'Manager'},`}</p>
            
            <p>
              I, <span className="font-bold">{user.name || '[Your Name]'}</span>, {isAcademic ? `bearing Roll No. ${user.designation || '[ID]'}` : `working as ${user.designation || '[Designation]'}`}, am writing this letter to formally request a leave of absence for 
              <span className="font-bold"> {request.duration} day(s)</span>, 
              effective from <span className="font-bold">{format(new Date(request.startDate), 'MMMM dd, yyyy')}</span> to 
              <span className="font-bold"> {format(new Date(request.endDate), 'MMMM dd, yyyy')}</span>.
            </p>
            
            <p className="bg-slate-50/50 p-4 rounded border-l-4 border-slate-200">
              <span className="font-semibold block mb-1">Purpose of Application:</span>
              {request.reason || (isAcademic ? 'I have urgent institutional/personal matters that require my presence elsewhere.' : 'I have personal matters that require my immediate attention.')}
            </p>
            
            <p>
              {isAcademic 
                ? 'I will ensure that I catch up with the missed lectures and assignments promptly upon my return. I kindly request you to grant me permission and mark my attendance accordingly.'
                : 'During my absence, I will ensure that all my ongoing responsibilities are prioritized and handed over to the relevant team members to minimize any disruption to the workflow.'}
            </p>
            
            <p>I would appreciate your approval of this request. Thank you for your continued support and understanding.</p>
          </div>

          {/* Closing & Signature */}
          <div className="mt-16 z-10">
            <p className="mb-4">{isAcademic ? 'Yours Obediently,' : 'Sincerely,'}</p>
            <div className="flex flex-col">
              {signature && plan !== 'FREE' && (
                <div className="mb-[-20px] ml-2">
                  <img src={signature} alt="Signature" className="h-16 object-contain" />
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200 w-fit min-w-[200px]">
                <p className="font-black text-lg leading-none">{user.name || '[Your Name]'}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{user.designation || '[Your Designation]'}</p>
              </div>
            </div>
          </div>

          {/* Footer Branding (Subtle) */}
          <div className="absolute bottom-8 left-0 right-0 text-center opacity-10 text-[8px] font-black uppercase tracking-[0.5em] pointer-events-none">
            Generated via LeaveGenie Utility System
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12 no-print px-4">
        <div className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Action & Sync</h4>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleAddToCalendar}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
              >
                <CalendarIcon size={14} /> Add to Calendar
              </button>
              <button 
                onClick={handleShareEmail}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                <Send size={14} /> Email Manager
              </button>
           </div>
        </div>

        <div className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Export Options</h4>
           <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => exportToPDF('leave-letter', `Application_${user.name.replace(/\s+/g, '_')}`)}
                className="flex flex-col items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
              >
                <Download size={16} /> PDF
              </button>
              <button 
                onClick={() => exportToImage('leave-letter', `Application_${user.name.replace(/\s+/g, '_')}`)}
                className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                <ImageIcon size={16} /> Image
              </button>
              <button 
                onClick={handlePrint}
                className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                <Printer size={16} /> Print
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
