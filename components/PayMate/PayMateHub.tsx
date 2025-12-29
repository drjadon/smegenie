
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  Receipt, 
  Landmark, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Timer,
  UserCheck,
  Users,
  CalendarCheck,
  FileCheck,
  Settings,
  Bell,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  ChevronDown,
  Sparkles,
  Banknote,
  ChevronRight,
  Printer,
  Calendar,
  X,
  PlusCircle,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import { SalaryStructure, ExpenseClaim, PlanType, LeaveRequest, UserProfile, AttendanceRecord, TeamMember, Transaction, Payslip } from '../../types';
import { STORAGE_KEYS, getCurrencySymbol } from '../../constants';
import { format, isSameMonth, parseISO, getDaysInMonth, startOfMonth, endOfMonth } from 'date-fns';
import { PayslipRenderer } from './PayslipRenderer';

interface PayMateHubProps {
  plan: PlanType;
  history: LeaveRequest[];
  user: UserProfile;
  teamMembers: TeamMember[];
  onRemoveMember: (id: string) => void;
  onUpdateMember: (member: TeamMember) => void;
  teamLeaveRequests?: LeaveRequest[];
  onUpdateTeamLeaveStatus?: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  claims?: ExpenseClaim[];
  onUpdateClaimStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onAddClaim: (claim: ExpenseClaim) => void;
  onAddTransaction: (t: Transaction) => void;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = [2024, 2025, 2026];

export const PayMateHub: React.FC<PayMateHubProps> = ({ 
  plan, 
  user, 
  teamMembers, 
  onUpdateMember,
  teamLeaveRequests = [],
  claims = [],
  onUpdateClaimStatus,
  onAddTransaction
}) => {
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'HISTORY' | 'REPORTS'>('MEMBERS');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const currencySymbol = getCurrencySymbol(user.defaultCurrency);

  // Modals/Views
  const [configMember, setConfigMember] = useState<TeamMember | null>(null);
  const [previewPayslip, setPreviewPayslip] = useState<Payslip | null>(null);
  
  // Payslip Storage
  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem('leavegenie_payslips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('leavegenie_payslips', JSON.stringify(payslips));
  }, [payslips]);

  const defaultStructure: SalaryStructure = {
    basic: 25000,
    hra: 10000,
    conveyance: 2000,
    specialAllowance: 5000,
    pf: 1800,
    profTax: 200,
    tds: 0
  };

  const handleSaveSalaryConfig = (structure: SalaryStructure) => {
    if (!configMember) return;
    onUpdateMember({ ...configMember, salaryStructure: structure });
    setConfigMember(null);
  };

  const calculateMemberPayroll = (member: TeamMember): Payslip | null => {
    const struct = member.salaryStructure || defaultStructure;
    const monthIdx = MONTHS.indexOf(selectedMonth);
    const totalDays = getDaysInMonth(new Date(selectedYear, monthIdx));
    
    // Calculate LOP (Loss of Pay)
    const memberLeaves = teamLeaveRequests.filter(l => 
        l.applicantId === member.id && 
        l.status === 'APPROVED' &&
        isSameMonth(parseISO(l.startDate), new Date(selectedYear, monthIdx))
    );
    
    const lopDays = memberLeaves.reduce((acc, curr) => acc + curr.duration, 0);
    const paidDays = totalDays - lopDays;
    
    const grossMonthly = struct.basic + struct.hra + struct.conveyance + struct.specialAllowance;
    const dayRate = grossMonthly / totalDays;
    const lopDeduction = lopDays * dayRate;

    const earnings = [
        { label: 'Basic Salary', amount: struct.basic },
        { label: 'HRA', amount: struct.hra },
        { label: 'Conveyance', amount: struct.conveyance },
        { label: 'Special Allowance', amount: struct.specialAllowance },
    ];

    const deductions = [
        { label: 'Provident Fund (PF)', amount: struct.pf },
        { label: 'Professional Tax', amount: struct.profTax },
        { label: 'TDS (Income Tax)', amount: struct.tds },
    ];

    if (lopDeduction > 0) {
        deductions.push({ label: `LOP (${lopDays} Days)`, amount: Math.round(lopDeduction) });
    }

    const totalEarnings = earnings.reduce((a, b) => a + b.amount, 0);
    const totalDeductions = deductions.reduce((a, b) => a + b.amount, 0);
    const netPay = totalEarnings - totalDeductions;

    return {
        id: Math.random().toString(36).substr(2, 9),
        memberId: member.id,
        memberName: member.name,
        month: selectedMonth,
        year: selectedYear,
        structure: struct,
        workingDays: totalDays,
        paidDays,
        lopDays,
        earnings,
        deductions,
        grossPay: totalEarnings,
        totalDeductions,
        netPay,
        timestamp: Date.now(),
        currency: user.defaultCurrency
    };
  };

  const processPayroll = (member: TeamMember) => {
    const payslip = calculateMemberPayroll(member);
    if (!payslip) return;
    
    const exists = payslips.find(p => p.memberId === member.id && p.month === selectedMonth && p.year === selectedYear);
    if (exists && !confirm("A payslip for this period already exists. Overwrite?")) return;

    if (exists) {
        setPayslips(prev => prev.map(p => p.id === exists.id ? payslip : p));
    } else {
        setPayslips(prev => [payslip, ...prev]);
    }

    const tx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'EXPENSE',
        amount: payslip.netPay,
        date: new Date().toISOString().split('T')[0],
        category: 'Payroll',
        paymentMode: 'BANK_TRANSFER',
        reference: `PAY-${member.id.substr(0,4).toUpperCase()}-${selectedMonth.substr(0,3).toUpperCase()}`,
        description: `Salary Payout: ${member.name} (${selectedMonth} ${selectedYear})`,
        timestamp: Date.now(),
        enterpriseId: user.enterpriseId || user.id,
        currency: user.defaultCurrency
    };
    onAddTransaction(tx);
    
    setPreviewPayslip(payslip);
  };

  const totalMonthlyPayout = useMemo(() => {
    return payslips
        .filter(p => p.month === selectedMonth && p.year === selectedYear)
        .reduce((acc, curr) => acc + curr.netPay, 0);
  }, [payslips, selectedMonth, selectedYear]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{selectedMonth} {selectedYear} Budget</p>
              <h3 className="text-4xl font-black tracking-tighter">{currencySymbol}{totalMonthlyPayout.toLocaleString()}</h3>
              <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                 <Calendar size={12} className="text-blue-500" /> Total Org. Payout
              </p>
           </div>
           <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
              <Banknote size={140} />
           </div>
        </div>
        {/* ... (rest of the header remains unchanged) ... */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
              <Users size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff Headcount</p>
              <p className="text-3xl font-black text-slate-900">{teamMembers.length}</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
           <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner">
              <AlertCircle size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Approvals</p>
              <p className="text-3xl font-black text-slate-900">{teamLeaveRequests.filter(r => r.status === 'PENDING').length}</p>
           </div>
        </div>
      </div>
      {/* ... (control bar remains unchanged) ... */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
         <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-full xl:w-auto shadow-inner">
            {(['MEMBERS', 'HISTORY', 'REPORTS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 xl:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'MEMBERS' ? 'Staff Payroll' : tab === 'HISTORY' ? 'Payslip Records' : 'Insights'}
              </button>
            ))}
         </div>

         <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-full xl:w-auto">
            <select 
                className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
            >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select 
                className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
            >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
         </div>
      </div>

      <div className="space-y-6">
         {activeTab === 'MEMBERS' && (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Organization Staff List</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Process salaries for {selectedMonth} {selectedYear}</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                     <PlusCircle size={14} /> Batch Process All
                  </button>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white border-b border-slate-100">
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Salary Setup</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Month Performance</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-12">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {teamMembers.map(member => {
                           const leaves = teamLeaveRequests.filter(l => 
                             l.applicantId === member.id && 
                             l.status === 'APPROVED' && 
                             isSameMonth(parseISO(l.startDate), new Date(selectedYear, MONTHS.indexOf(selectedMonth)))
                           );
                           const lop = leaves.reduce((acc, curr) => acc + curr.duration, 0);
                           const hasProcessed = payslips.some(p => p.memberId === member.id && p.month === selectedMonth && p.year === selectedYear);

                           return (
                             <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-200 uppercase">
                                         {member.name.charAt(0)}
                                      </div>
                                      <div>
                                         <p className="font-black text-slate-900 text-sm">{member.name}</p>
                                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.role}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   {member.salaryStructure ? (
                                      <div className="space-y-1">
                                         <p className="text-sm font-black text-slate-900">{currencySymbol}{((member.salaryStructure.basic + member.salaryStructure.hra + member.salaryStructure.conveyance + member.salaryStructure.specialAllowance)).toLocaleString()}</p>
                                         <button onClick={() => setConfigMember(member)} className="text-[9px] font-black text-blue-600 uppercase hover:underline">Edit Structure</button>
                                      </div>
                                   ) : (
                                      <button onClick={() => setConfigMember(member)} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-tight hover:bg-amber-100 transition-all">
                                         <Settings size={12} /> Needs Setup
                                      </button>
                                   )}
                                </td>
                                <td className="px-8 py-6 text-center">
                                   <div className="flex flex-col items-center">
                                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lop > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                         {lop > 0 ? `${lop} Days LOP` : 'Full Presence'}
                                      </span>
                                      <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{leaves.length} Approved Leaves</p>
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-right pr-12">
                                   <div className="flex justify-end gap-3">
                                      {hasProcessed ? (
                                         <button 
                                            onClick={() => setPreviewPayslip(payslips.find(p => p.memberId === member.id && p.month === selectedMonth && p.year === selectedYear)!)}
                                            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100"
                                         >
                                            View Payslip
                                         </button>
                                      ) : (
                                         <button 
                                            onClick={() => processPayroll(member)}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2"
                                         >
                                            <ArrowUpRight size={14} /> Run Payroll
                                         </button>
                                      )}
                                   </div>
                                </td>
                             </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         {/* ... (rest of the component remains unchanged) ... */}
         {activeTab === 'HISTORY' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {payslips.filter(p => p.month === selectedMonth && p.year === selectedYear).map(slip => (
                    <div key={slip.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                             {slip.memberName.charAt(0)}
                          </div>
                          <button onClick={() => setPreviewPayslip(slip)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                             <Printer size={18} />
                          </button>
                       </div>
                       <h4 className="font-black text-slate-900 text-lg mb-1">{slip.memberName}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">{slip.month} {slip.year} • {slip.paidDays}/{slip.workingDays} Days</p>
                       
                       <div className="space-y-2 border-t border-slate-50 pt-6">
                          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                             <span>Net Payout</span>
                             <span className="text-slate-900">{getCurrencySymbol(slip.currency)}{slip.netPay.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-medium text-slate-400">
                             <span>Total Deductions</span>
                             <span className="text-rose-500">- {getCurrencySymbol(slip.currency)}{slip.totalDeductions.toLocaleString()}</span>
                          </div>
                       </div>

                       <button 
                        onClick={() => setPreviewPayslip(slip)}
                        className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 transition-all"
                       >
                        Preview Document
                       </button>
                    </div>
                  ))}
               </div>
               
               {payslips.filter(p => p.month === selectedMonth && p.year === selectedYear).length === 0 && (
                  <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                     <FileText size={64} className="mx-auto text-slate-100 mb-4" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No payslips generated for this period</p>
                  </div>
               )}
            </div>
         )}

         {activeTab === 'REPORTS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Annual Payout Trend</h3>
                  <div className="h-64 flex items-end justify-between gap-2 px-2">
                     {MONTHS.map((m, i) => {
                        const monthlyTotal = payslips
                            .filter(p => p.month === m && p.year === selectedYear)
                            .reduce((acc, curr) => acc + curr.netPay, 0);
                        const max = Math.max(...MONTHS.map(mn => payslips.filter(p => p.month === mn && p.year === selectedYear).reduce((acc, curr) => acc + curr.netPay, 0)), 1000);
                        const height = (monthlyTotal / max) * 100;
                        
                        return (
                          <div key={m} className="flex-1 group relative">
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {currencySymbol}{monthlyTotal.toLocaleString()}
                             </div>
                             <div 
                                style={{ height: `${height}%` }}
                                className={`w-full rounded-t-lg transition-all duration-1000 ${m === selectedMonth ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                             />
                             <p className="text-[7px] font-black uppercase text-slate-400 mt-2 text-center">{m.substr(0,1)}</p>
                          </div>
                        );
                     })}
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Payout Distribution</h3>
                  <div className="space-y-6">
                     {teamMembers.map(member => {
                        const totalYearly = payslips
                            .filter(p => p.memberId === member.id && p.year === selectedYear)
                            .reduce((acc, curr) => acc + curr.netPay, 0);
                        const allPayouts = payslips.filter(p => p.year === selectedYear).reduce((acc, curr) => acc + curr.netPay, 0) || 1;
                        const percent = (totalYearly / allPayouts) * 100;

                        return (
                          <div key={member.id} className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>{member.name}</span>
                                <span className="text-slate-900">{currencySymbol}{totalYearly.toLocaleString()}</span>
                             </div>
                             <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                <div style={{ width: `${percent}%` }} className="h-full bg-blue-600 rounded-full" />
                             </div>
                          </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         )}
      </div>
      {/* ... (modals remain unchanged) ... */}
    </div>
  );
};
