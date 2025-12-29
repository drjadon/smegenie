
import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Zap, Globe, Star, Info, Users, Crown } from 'lucide-react';
import { PlanType, SubscriptionPlanConfig } from '../types';

interface PlanSelectorProps {
  currentPlan: PlanType;
  onSelect: (plan: PlanType) => void;
}

const ENTERPRISE_RATE = 49;
const ENTERPRISE_TIERS = [
  { users: 10, price: 10 * ENTERPRISE_RATE },
  { users: 25, price: 25 * ENTERPRISE_RATE },
  { users: 50, price: 50 * ENTERPRISE_RATE },
  { users: 100, price: 100 * ENTERPRISE_RATE },
  { users: 500, price: 500 * ENTERPRISE_RATE },
];

export const PlanSelector: React.FC<PlanSelectorProps> = ({ currentPlan, onSelect }) => {
  const [selectedEntTier, setSelectedEntTier] = useState(0);
  
  // Load dynamic plans from admin settings or use defaults in INR
  const [plans, setPlans] = useState<SubscriptionPlanConfig[]>(() => {
    const saved = localStorage.getItem('leavegenie_admin_plans');
    if (saved) return JSON.parse(saved);
    
    return [
      { 
        id: 'FREE', 
        name: 'Starter', 
        price: 0, 
        currency: 'INR', 
        billingCycle: 'monthly', 
        features: ['Professional PDF Export', 'Govt. Leave Templates', '3 History Records', 'Basic Resume Maker'] 
      },
      { 
        id: 'PRO', 
        name: 'Professional', 
        price: 499, 
        currency: 'INR', 
        billingCycle: 'monthly', 
        features: ['AI Reason Polishing', 'Unlimited Records', '10+ Resume Templates', 'Digital Signature Support', 'Priority AI Assistant'] 
      },
      { 
        id: 'ENTERPRISE', 
        name: 'Business', 
        price: ENTERPRISE_RATE, 
        currency: 'INR', 
        billingCycle: 'monthly', 
        features: ['Full PayMate Hub', 'Team Management', 'Institutional Ledger', 'Attendance Tracking', 'Custom Invoice Studio', 'Multi-user Admin Control'] 
      },
    ];
  });

  const getPlanMeta = (id: PlanType) => {
    switch(id) {
      case 'FREE': return { icon: <Zap size={20} />, color: 'bg-slate-100 text-slate-700', btnColor: 'bg-slate-200 text-slate-800' };
      case 'PRO': return { icon: <ShieldCheck size={20} />, color: 'bg-blue-600 text-white', btnColor: 'bg-blue-600 text-white shadow-lg shadow-blue-200', featured: true };
      case 'ENTERPRISE': return { icon: <Globe size={20} />, color: 'bg-indigo-900 text-white', btnColor: 'bg-indigo-900 text-white shadow-lg shadow-indigo-200', isEnterprise: true };
    }
  };

  return (
    <div className="space-y-12 py-6">
      <div className="text-center space-y-3 px-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Professional SME Plans</h2>
        <p className="text-slate-500 max-w-lg mx-auto text-lg font-medium italic">Scalable solutions for individuals and organizations. Prices in INR.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch px-2">
        {plans.map((plan) => {
          const meta = getPlanMeta(plan.id);
          const isCurrent = currentPlan === plan.id;
          const displayPrice = plan.id === 'ENTERPRISE' ? ENTERPRISE_TIERS[selectedEntTier].price : plan.price;

          return (
            <div 
              key={plan.id}
              className={`relative p-6 md:p-8 rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col justify-between ${
                isCurrent 
                ? 'border-blue-500 bg-blue-50/40 ring-4 ring-blue-500/10' 
                : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
              } ${meta.featured ? 'md:scale-[1.08] z-10 shadow-xl' : 'scale-100'}`}
            >
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
                  Active Subscription
                </div>
              )}
              
              {meta.featured && !isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 z-20">
                  <Star size={10} fill="currentColor" /> Best Value
                </div>
              )}

              <div>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${meta.color} shadow-lg shadow-current/10`}>
                    {meta.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{plan.name}</h3>
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹{displayPrice.toLocaleString()}</span>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/month</span>
                    </div>
                    {plan.id === 'ENTERPRISE' && (
                      <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">₹{ENTERPRISE_RATE} Per User</span>
                    )}
                  </div>
                </div>

                {plan.id === 'ENTERPRISE' && (
                  <div className="mb-6 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center mb-2">Select User Count</label>
                    <div className="flex flex-wrap justify-center gap-2">
                      {ENTERPRISE_TIERS.map((tier, idx) => (
                        <button
                          key={tier.users}
                          onClick={() => setSelectedEntTier(idx)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                            selectedEntTier === idx 
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' 
                            : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          {tier.users} Users
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-10 mt-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Included Features</p>
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-slate-800">
                        <div className="mt-0.5 rounded-full p-0.5 shrink-0 bg-green-100 text-green-600">
                          <Check size={10} strokeWidth={4} />
                        </div>
                        <span className="font-bold leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelect(plan.id)}
                disabled={isCurrent}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest ${meta.btnColor}`}
              >
                {isCurrent ? 'Current Selection' : `Activate ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group max-w-4xl mx-auto">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <div className="shrink-0 w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
              <Users size={40} />
           </div>
           <div className="flex-1 space-y-2">
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Need a custom volume solution?</h4>
              <p className="text-slate-500 font-medium text-sm">For organizations with over 500+ employees, we offer custom billing rates, white-labeling, and dedicated support servers.</p>
           </div>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              Contact Sales
           </button>
        </div>
      </div>
    </div>
  );
};
