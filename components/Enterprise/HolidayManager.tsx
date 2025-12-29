
import React, { useState } from 'react';
import { 
  CalendarHeart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  FileText, 
  Search,
  ChevronRight,
  Sparkles,
  XCircle,
  MapPin,
  Clock
} from 'lucide-react';
import { Holiday } from '../../types';
import { format, parseISO, isAfter, isBefore } from 'date-fns';

interface HolidayManagerProps {
  holidays: Holiday[];
  enterpriseId: string;
  onSave: (holiday: Holiday) => void;
  onDelete: (id: string) => void;
}

export const HolidayManager: React.FC<HolidayManagerProps> = ({ 
  holidays, enterpriseId, onSave, onDelete 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Holiday>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'PUBLIC',
    description: ''
  });

  const filteredHolidays = holidays
    .filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const upcomingHolidays = filteredHolidays.filter(h => isAfter(parseISO(h.date), new Date()));
  const pastHolidays = filteredHolidays.filter(h => isBefore(parseISO(h.date), new Date()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date) return;
    
    const holiday: Holiday = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      date: formData.date,
      type: formData.type as any,
      description: formData.description,
      enterpriseId
    };

    onSave(holiday);
    setShowAdd(false);
    setFormData({ name: '', date: new Date().toISOString().split('T')[0], type: 'PUBLIC', description: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
             <CalendarHeart size={32} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Calendar</h2>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage holidays for all team members</p>
           </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Add Holiday
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="text-indigo-500" size={18} /> Upcoming Off-Days ({upcomingHolidays.length})
              </h3>
              <div className="relative w-48">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                 <input 
                   placeholder="Search..." 
                   className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingHolidays.map(h => (
                <div key={h.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all flex flex-col justify-between">
                   <div>
                      <div className="flex justify-between items-start mb-4">
                         <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                           h.type === 'INSTITUTIONAL' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                         }`}>
                           {h.type}
                         </span>
                         <button onClick={() => onDelete(h.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                      </div>
                      <p className="text-lg font-black text-slate-900 mb-1">{h.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <Calendar size={12} /> {format(parseISO(h.date), 'MMMM dd, yyyy')}
                      </p>
                      {h.description && <p className="mt-3 text-xs text-slate-500 italic">"{h.description}"</p>}
                   </div>
                   <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Auto-sync active</p>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                   </div>
                </div>
              ))}
              
              {upcomingHolidays.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                   <Calendar Heart size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your calendar is clear</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-2">
             <Clock className="text-slate-400" size={18} /> Archive
           </h3>
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                 {pastHolidays.map(h => (
                   <div key={h.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                         <p className="font-bold text-slate-700 text-sm">{h.name}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{format(parseISO(h.date), 'MMM dd, yyyy')}</p>
                      </div>
                      <XCircle size={14} className="text-slate-200" />
                   </div>
                 ))}
                 {pastHolidays.length === 0 && (
                   <div className="p-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">No past records</div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">New Holiday</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Define a globally synced off-day</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Holiday Name</label>
                    <input 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" 
                      placeholder="e.g. Annual Sports Meet"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Date</label>
                       <input 
                         type="date" 
                         required 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700"
                         value={formData.date}
                         onChange={e => setFormData({...formData, date: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Category</label>
                       <select 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 appearance-none"
                         value={formData.type}
                         onChange={e => setFormData({...formData, type: e.target.value as any})}
                       >
                          <option value="PUBLIC">Public</option>
                          <option value="INSTITUTIONAL">Institutional</option>
                          <option value="FESTIVAL">Festival</option>
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Notes (Optional)</label>
                    <textarea 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 min-h-[100px]" 
                      placeholder="Details about the holiday..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>

                 <div className="flex gap-3">
                    <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                      Sync Holiday
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
