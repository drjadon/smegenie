
import React, { useState } from 'react';
import { UserProfile, PlanType, LeaveBalance, Gender, EmployeeType, EmployerProfile } from '../types';
import { Building2, MapPin, Mail, Phone, Info, UserCircle, PenTool, Layout, Crown, Briefcase, User, Map, Settings2, Repeat, Fingerprint, Coins, BriefcaseBusiness, School } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { EmployerForm } from './EmployerForm';
import { INDIAN_STATES, CARRY_FORWARD_TYPES, CURRENCIES } from '../constants';

interface ProfileFormProps {
  data: UserProfile;
  onSave: (data: UserProfile) => void;
  plan: PlanType;
  signature: string;
  onSaveSignature: (sig: string) => void;
  initialTab?: 'INFO' | 'SIGNATURE' | 'EMPLOYERS';
  balance: LeaveBalance;
  onUpdateBalance: (balance: LeaveBalance) => void;
  employers: EmployerProfile[];
  onSaveEmployers: (employers: EmployerProfile[]) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  data, 
  onSave, 
  plan, 
  signature, 
  onSaveSignature,
  initialTab = 'INFO',
  balance,
  onUpdateBalance,
  employers,
  onSaveEmployers
}) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'SIGNATURE' | 'EMPLOYERS'>(initialTab);
  const [formData, setFormData] = React.useState<UserProfile>({
    ...data,
    address: data.address || '',
    email: data.email || '',
    phone: data.phone || '',
    about: data.about || '',
    gender: data.gender || '',
    employeeType: data.employeeType || '',
    state: data.state || '',
    gstNumber: data.gstNumber || '',
    defaultCurrency: data.defaultCurrency || 'INR'
  });
  
  const [tempBalance, setTempBalance] = useState<LeaveBalance>(balance);
  const isEnterprise = plan === 'ENTERPRISE';
  const isPro = plan === 'PRO' || plan === 'ENTERPRISE';
  const isStudentOrIntern = formData.employeeType === 'STUDENT' || formData.employeeType === 'INTERN';

  const handleBalanceChange = (key: keyof LeaveBalance, value: string) => {
    const num = parseInt(value) || 0;
    setTempBalance({ ...tempBalance, [key]: num });
  };

  const handleGlobalSave = () => {
    onSave(formData);
    if (isPro) {
      onUpdateBalance(tempBalance);
    }
  };

  const balanceItems = [
    { key: 'cl', label: 'Casual (CL)' },
    { key: 'el', label: 'Earned (EL)' },
    { key: 'hpl', label: 'Medical (HPL)' },
    { key: 'rh', label: 'Restricted (RH)' },
    { key: 'ccl', label: 'Child Care (CCL)', hide: formData.gender === 'MALE' },
    { key: 'maternity', label: 'Maternity', hide: formData.gender === 'MALE' },
    { key: 'paternity', label: 'Paternity', hide: formData.gender === 'FEMALE' },
    { key: 'medical', label: 'Commuted' }
  ].filter(item => !item.hide);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tabs Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-full max-w-lg mx-auto shadow-inner">
        <button 
          onClick={() => setActiveTab('INFO')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'INFO' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          <Layout size={14} /> Details
        </button>
        {!isEnterprise && (
          <button 
            onClick={() => setActiveTab('EMPLOYERS')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'EMPLOYERS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <BriefcaseBusiness size={14} /> {isStudentOrIntern ? 'Institutes' : 'Jobs'}
          </button>
        )}
        <button 
          onClick={() => setActiveTab('SIGNATURE')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'SIGNATURE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          <PenTool size={14} /> Signature
        </button>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {activeTab === 'INFO' ? (
          <>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                {isEnterprise ? <Building2 size={24} /> : isStudentOrIntern ? <School size={24} /> : <UserCircle size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {isEnterprise ? 'Institute Profile' : 'User Identity'}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {isEnterprise ? 'Manage Institution Details' : 'Manage Your Account'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {isEnterprise ? 'Institute Name' : 'Full Name'}
                </label>
                <div className="relative">
                  {isEnterprise ? <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /> : <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />}
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    value={isEnterprise ? formData.company : formData.name}
                    onChange={(e) => isEnterprise 
                      ? setFormData({ ...formData, company: e.target.value }) 
                      : setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={isEnterprise ? "St. Xavier's High School" : "John Doe"}
                  />
                </div>
              </div>

              {!isEnterprise && (
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {isStudentOrIntern ? 'Course / Roll Number / Rank' : 'Designation / Role'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder={isStudentOrIntern ? "B.Tech CSE / 2021-001" : "Senior Teacher / Administrator"}
                  />
                </div>
              )}

              {/* Tax Info Section for both Enterprise and Individual Professionals */}
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                   <Fingerprint size={12} className="text-blue-500" /> {isStudentOrIntern ? 'Institute ID' : 'GSTIN'}
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-black text-indigo-600 tracking-widest placeholder:font-normal placeholder:tracking-normal"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  placeholder={isStudentOrIntern ? "UNIV-12345" : "e.g. 07AAAAA..."}
                />
              </div>

              {/* Currency Selector */}
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                   <Coins size={12} className="text-amber-500" /> Default Currency
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                    value={formData.defaultCurrency}
                    onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>
                    ))}
                  </select>
                  <Coins className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>

              {!isEnterprise && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Gender
                    </label>
                    <select
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Category
                    </label>
                    <select
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                      value={formData.employeeType}
                      onChange={(e) => setFormData({ ...formData, employeeType: e.target.value as EmployeeType, state: (e.target.value === 'STATE_GOVT' || e.target.value === 'STUDENT') ? formData.state : '' })}
                    >
                      <option value="">Select Category</option>
                      <option value="PRIVATE">Private Sector</option>
                      <option value="CENTRAL_GOVT">Central Government</option>
                      <option value="STATE_GOVT">State Government</option>
                      <option value="STUDENT">Student (Academic)</option>
                      <option value="INTERN">Intern (Professional)</option>
                    </select>
                  </div>

                  {(formData.employeeType === 'STATE_GOVT' || formData.employeeType === 'STUDENT') && (
                    <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Select State
                      </label>
                      <select
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      >
                        <option value="">Choose State...</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                </>
              )}

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {isEnterprise ? 'Physical Address' : 'Personal Address'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Education Lane, Knowledge Park"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Official Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@institute.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="tel"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 800-INST-EDU"
                  />
                </div>
              </div>

              {isPro && !isEnterprise && (
                <div className="md:col-span-2 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                       <Settings2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Adjust {isStudentOrIntern ? 'Attendance' : 'Leave'} Balances</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Modify opening totals for your ledger</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {balanceItems.map(item => {
                      const isCarry = CARRY_FORWARD_TYPES.includes(item.key);
                      return (
                        <div key={item.key}>
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-1">
                            {item.label}
                            {isCarry && <Repeat size={8} className="text-emerald-500" />}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              className={`w-full px-3 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-slate-700 ${isCarry ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}
                              value={tempBalance[item.key as keyof LeaveBalance]}
                              onChange={(e) => handleBalanceChange(item.key as keyof LeaveBalance, e.target.value)}
                            />
                            {isCarry && (
                              <span className="absolute -top-1.5 -right-1 bg-white border border-emerald-200 text-[6px] font-black text-emerald-600 px-1 py-0.5 rounded shadow-sm uppercase">Accumulated</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGlobalSave}
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Save {isEnterprise ? 'Institute Configuration' : 'Profile Changes'}
            </button>
          </>
        ) : activeTab === 'SIGNATURE' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <PenTool size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Digital Signature</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setup your official sign for applications</p>
              </div>
            </div>
            
            <SignaturePad 
              onSave={onSaveSignature}
              initialValue={signature}
              onCancel={() => setActiveTab('INFO')}
            />
            
            {plan === 'FREE' && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4 text-amber-700">
                <Crown size={20} className="shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-wide">Signature embedding is a PRO feature. Upgrade to include your sign in PDFs.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <BriefcaseBusiness size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isStudentOrIntern ? 'Saved Institutions' : 'Saved Employers'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isStudentOrIntern ? 'Manage college/school authority details' : 'Manage your workplace manager details'}</p>
              </div>
            </div>
            
            <EmployerForm 
              employers={employers}
              onSave={onSaveEmployers}
              canAddMultiple={plan !== 'FREE'}
              isStudent={isStudentOrIntern}
            />
          </div>
        )}
      </div>
    </div>
  );
};
