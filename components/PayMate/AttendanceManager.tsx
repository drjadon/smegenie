import React from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Timer,
  UserCheck,
  ChevronRight,
  Download
} from 'lucide-react';
import { TeamMember, AttendanceRecord } from '../../types';
import { format, differenceInMinutes, isToday, parseISO } from 'date-fns';

interface AttendanceManagerProps {
  teamMembers: TeamMember[];
  attendanceRecords: AttendanceRecord[];
  onMarkAttendance: (memberId: string, type: 'IN' | 'OUT') => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ 
  teamMembers, 
  attendanceRecords, 
  onMarkAttendance 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const calculateHours = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return 'Active';
    const start = parseISO(checkIn);
    const end = parseISO(checkOut);
    const minutes = differenceInMinutes(end, start);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getTodayRecord = (memberId: string) => {
    return attendanceRecords.find(r => r.memberId === memberId && isToday(parseISO(r.date)));
  };

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Tools */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search staff by name or role..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Team Attendance Table/Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-5 gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Member</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check In</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Time</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</span>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredMembers.map((member) => {
            const todayRecord = getTodayRecord(member.id);
            const isActive = todayRecord && !todayRecord.checkOut;
            const isCompleted = todayRecord && todayRecord.checkOut;

            return (
              <div key={member.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 items-center hover:bg-slate-50/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 border border-slate-200 shrink-0">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    isActive ? 'bg-emerald-50 text-emerald-600' : 
                    isCompleted ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isActive ? 'Present' : isCompleted ? 'Logged Out' : 'Absent'}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-600">
                  {todayRecord ? (
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-300" />
                      {format(parseISO(todayRecord.checkIn), 'hh:mm a')}
                    </div>
                  ) : '--:--'}
                </div>

                <div className="text-xs font-black text-slate-900">
                  {todayRecord ? (
                    <div className="flex items-center gap-1.5">
                      <Timer size={12} className={isActive ? 'text-emerald-500 animate-pulse' : 'text-slate-300'} />
                      {calculateHours(todayRecord.checkIn, todayRecord.checkOut)}
                    </div>
                  ) : '0h 0m'}
                </div>

                <div className="flex justify-end gap-2">
                  {!todayRecord && (
                    <button 
                      onClick={() => onMarkAttendance(member.id, 'IN')}
                      className="bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-100 transition-all"
                      title="Manual Check-In"
                    >
                      <UserCheck size={18} />
                    </button>
                  )}
                  {isActive && (
                    <button 
                      onClick={() => onMarkAttendance(member.id, 'OUT')}
                      className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100 transition-all"
                      title="Force Check-Out"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  <button className="p-2 text-slate-300 hover:text-slate-900 transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredMembers.length === 0 && (
            <div className="py-20 text-center">
              <Users size={48} className="mx-auto text-slate-100 mb-4" />
              <p className="text-slate-400 font-bold">No staff members found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={18} /> Recent Logs
          </h3>
          <div className="space-y-4">
            {attendanceRecords.slice(0, 5).map(record => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">
                    {record.memberName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{record.memberName}</p>
                    <p className="text-[10px] text-slate-500">{format(parseISO(record.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-slate-700">{calculateHours(record.checkIn, record.checkOut)}</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase">Worked</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <MapPin className="text-blue-500" size={18} /> Location Map (Simulated)
          </h3>
          <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
             <div className="text-center p-6">
                <MapPin className="mx-auto text-blue-300 mb-2" size={32} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geo-fencing active</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">Tracking {attendanceRecords.filter(r => r.location && isToday(parseISO(r.date))).length} live location pings</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};