
import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  FileCheck, 
  Layout, 
  Users, 
  Globe, 
  Star,
  Check,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Smartphone,
  MessageSquare
} from 'lucide-react';
import { AppScreen } from '../../types';
import { PlanSelector } from '../PlanSelector';

interface LandingPageProps {
  onNavigate: (screen: AppScreen, params?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">SMEGenie</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Pricing', 'Testimonials'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate(AppScreen.AUTH)}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest"
            >
              Log In
            </button>
            <button 
              onClick={() => onNavigate(AppScreen.AUTH, { isSignup: true })}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.05] transition-all uppercase tracking-widest"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8 animate-bounce">
            <Zap size={14} fill="currentColor" /> New: AI Business Insights is Live
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
            Professional SME <br /> <span className="text-blue-600">Solutions in Seconds.</span>
          </h1>
          
          <p className="max-w-2xl text-slate-500 text-lg md:text-xl font-medium mb-12 leading-relaxed">
            Empowering organizations and students to manage operations, track attendance, and generate formal documentation instantly. SMEGenie is your unified professional ledger.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => onNavigate(AppScreen.AUTH, { isSignup: true })}
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Start Building Now <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
            >
              Watch Demo
            </button>
          </div>

          <div className="mt-20 relative w-full max-w-5xl group">
             <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000"></div>
             <div className="relative bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="p-8 text-center space-y-4">
                   <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <Layout size={40} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900">Operations Preview</h3>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Login to see your institutional hub</p>
                </div>
             </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Trusted by Organizations at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale contrast-200">
             <span className="text-2xl font-black">GOOGLE</span>
             <span className="text-2xl font-black">DELOITTE</span>
             <span className="text-2xl font-black">TCS</span>
             <span className="text-2xl font-black">INFOSYS</span>
             <span className="text-2xl font-black">MIT</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
             <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Capabilities</h2>
             <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Everything you need <br /> to run your professional world.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Sparkles />, 
                title: 'AI Operation Logic', 
                desc: 'Transform simple inputs into formal, high-impact business communication with SMEGenie AI.', 
                color: 'bg-blue-50 text-blue-600' 
              },
              { 
                icon: <ShieldCheck />, 
                title: 'Compliance Tracking', 
                desc: 'Automatic tracking for entitlements and expenses based on modern industry standards.', 
                color: 'bg-emerald-50 text-emerald-600' 
              },
              { 
                icon: <Smartphone />, 
                title: 'Professional Reporting', 
                desc: 'One-click high-resolution export for legal, printing, or digital auditing.', 
                color: 'bg-amber-50 text-amber-600' 
              },
              { 
                icon: <Users />, 
                title: 'Workforce Hub', 
                desc: 'Full-scale workforce administration. Approve requests and track live attendance.', 
                color: 'bg-indigo-50 text-indigo-600' 
              },
              { 
                icon: <FileCheck />, 
                title: 'Document Studio', 
                desc: 'Build world-class invoices and resumes with 10+ premium templates included.', 
                color: 'bg-rose-50 text-rose-600' 
              },
              { 
                icon: <Globe />, 
                title: 'Global Connectivity', 
                desc: 'Manage multiple offices and remote teams from a single unified SMEGenie dashboard.', 
                color: 'bg-slate-900 text-white shadow-xl' 
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:border-blue-500 transition-all hover:translate-y-[-8px] group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 ${f.color}`}>
                  {React.cloneElement(f.icon as React.ReactElement, { size: 28 })}
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-slate-900 text-white rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto">
          <PlanSelector currentPlan="FREE" onSelect={() => onNavigate(AppScreen.AUTH, { isSignup: true })} />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                   "SMEGenie digitized our entire administrative workflow in one week."
                </h2>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-600 text-xl shadow-lg">RK</div>
                   <div>
                      <p className="font-black text-slate-900">Rahul Kapoor</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Senior Operations • Tech Hub</p>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-6">
                {[
                  { val: '50k+', label: 'Active Users' },
                  { val: '200k+', label: 'Invoices Issued' },
                  { val: '4.9/5', label: 'Platform Rating' },
                  { val: '120+', label: 'SME Businesses' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] text-center border border-slate-100">
                     <p className="text-3xl font-black text-blue-600 mb-2">{stat.val}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Sparkles size={24} fill="currentColor" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">SMEGenie</span>
              </div>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                The most advanced business management and professional utility suite for small to medium enterprises.
              </p>
              <div className="flex items-center gap-4">
                 <a href="#" className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:text-blue-600 transition-colors"><Instagram size={18} /></a>
                 <a href="#" className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:text-blue-600 transition-colors"><Twitter size={18} /></a>
                 <a href="#" className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>
                 <a href="#" className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:text-blue-600 transition-colors"><Github size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#features" className="hover:text-blue-600 transition-all">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 transition-all">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-blue-600 transition-all">Testimonials</a></li>
                <li><button onClick={() => onNavigate(AppScreen.AUTH)} className="hover:text-blue-600">Dashboard</button></li>
                <li><button onClick={() => onNavigate(AppScreen.AUTH, { isSignup: true })} className="hover:text-blue-600">Free Trial</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Resources</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">API Access</a></li>
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 flex items-center gap-2"><MessageSquare size={14} /> Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><button onClick={() => onNavigate(AppScreen.PRIVACY)} className="hover:text-blue-600">Privacy Policy</button></li>
                <li><button onClick={() => onNavigate(AppScreen.TERMS)} className="hover:text-blue-600">Terms of Service</button></li>
                <li><button onClick={() => onNavigate(AppScreen.REFUND)} className="hover:text-blue-600">Refund Policy</button></li>
                <li><a href="#" className="hover:text-blue-600">Cookie Settings</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 SMEGENIE SMART SYSTEMS. ALL RIGHTS RESERVED.</p>
             <div className="flex items-center gap-2 text-slate-400 font-bold text-xs italic">
                <ShieldCheck size={14} /> Secured with AES-256 Encryption
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
