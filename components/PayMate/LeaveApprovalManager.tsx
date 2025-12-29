import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight,
  FileText,
  AlertCircle,
  Inbox
} from 'lucide-react';
import { LeaveRequest } from '../../types';
import { format, parseISO } from 'date-fns';

interface LeaveApprovalManagerProps {
  requests: LeaveRequest[];
  onAction: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}

export const LeaveApprovalManager: React.FC<LeaveApprovalManagerProps> = ({ requests, onAction }) => {
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const pastRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-10">
      {/* Pending Requests */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Inbox className="text-blue-500" size={18} /> Pending Approval ({pendingRequests.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingRequests.map(request => (
            <div key={request.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 border border-slate-200">
                      {request.applicantName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{request.applicantName}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{request.leaveType}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                    Pending
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Calendar size={14} className="text-slate-300" />
                      {format(parseISO(request.startDate), 'MMM dd')} - {format(parseISO(request.endDate), 'MMM dd, yyyy')}
                      <span className="text-blue-500 ml-auto">({request.duration} Days)</span>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Reason:</span>
                        "{request.reason}"
                      </p>
                   </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => onAction(request.id, 'APPROVED')}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50"
                >
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button 
                  onClick={() => onAction(request.id, 'REJECTED')}
                  className="flex-1 bg-white border border-slate-200 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <Inbox size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">Inbox clear. No new leave requests.</p>
            </div>
          )}
        </div>
      </section>

      {/* History */}
      {pastRequests.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2 border-t border-slate-100 pt-10">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Clock className="text-slate-400" size={18} /> Decision History
            </h3>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="divide-y divide-slate-50">
                {pastRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                         request.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-400'
                       }`}>
                         {request.applicantName?.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 text-sm">{request.applicantName}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {request.leaveType} • {request.duration} Days
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                         request.status === 'APPROVED' ? 'text-emerald-600' : 'text-red-500'
                       }`}>
                         {request.status}
                       </div>
                       <p className="text-[9px] font-bold text-slate-400">{format(request.timestamp, 'MMM dd')}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}
    </div>
  );
};