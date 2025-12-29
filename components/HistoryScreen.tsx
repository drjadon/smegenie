
import React from 'react';
import { LeaveRequest } from '../types';
import { Calendar, Building2, ChevronRight, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryScreenProps {
  history: LeaveRequest[];
  onViewRequest: (request: LeaveRequest) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onViewRequest }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredHistory = history.filter(h => 
    h.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.employerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search history..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="mx-auto text-slate-200 mb-4" size={64} />
            <p className="text-slate-400 font-medium">No records found</p>
          </div>
        ) : (
          filteredHistory.map((req) => (
            <button
              key={req.id}
              onClick={() => onViewRequest(req)}
              className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-all text-left"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-slate-900">{req.leaveType}</p>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {req.duration} Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 size={12} /> {req.employerName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {req.startDate} to {req.endDate}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
