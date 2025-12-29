
import React from 'react';
import { Sparkles, ArrowLeft, Shield, Scale, CreditCard } from 'lucide-react';
import { AppScreen } from '../../types';

interface PolicyProps {
  onBack: () => void;
}

const PolicyLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; onBack: () => void }> = ({ title, icon, children, onBack }) => (
  <div className="min-h-screen bg-slate-50 py-20 px-6">
    <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[3rem] border border-slate-200 shadow-xl">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest mb-12 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Landing
      </button>

      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Last Updated: May 2024</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed font-medium">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPolicy: React.FC<PolicyProps> = ({ onBack }) => (
  <PolicyLayout title="Privacy Policy" icon={<Shield size={32} />} onBack={onBack}>
    <h2 className="text-2xl mt-8 mb-4">1. Data Collection</h2>
    <p>At SMEGenie, we prioritize your data security. We collect minimal information required to provide our services, including your name, professional email, and the business records you manage.</p>
    
    <h2 className="text-2xl mt-8 mb-4">2. Digital Signatures</h2>
    <p>Digital signatures created on our platform are stored locally in your browser (LocalStorage) and are never uploaded to our servers unless you explicitly sync them with your cloud account (Enterprise Feature).</p>
    
    <h2 className="text-2xl mt-8 mb-4">3. Third-Party Services</h2>
    <p>We use Gemini AI for intelligent insights. Your raw business data is processed securely and is not used for training global models. Payment processing is handled by secure gateways like Stripe and Razorpay.</p>
    
    <h2 className="text-2xl mt-8 mb-4">4. Cookies</h2>
    <p>We use functional cookies to maintain your session and preferences. We do not use tracking cookies for cross-site advertising.</p>
  </PolicyLayout>
);

export const RefundPolicy: React.FC<PolicyProps> = ({ onBack }) => (
  <PolicyLayout title="Refund Policy" icon={<CreditCard size={32} />} onBack={onBack}>
    <h2 className="text-2xl mt-8 mb-4">1. Subscription Plans</h2>
    <p>SMEGenie offers Monthly and Annual subscriptions. You may cancel your subscription at any time. Once cancelled, your Pro or Enterprise benefits will continue until the end of your current billing period.</p>
    
    <h2 className="text-2xl mt-8 mb-4">2. Refund Eligibility</h2>
    <p>Due to the digital nature of our generated documents and AI operation credits, we generally do not offer refunds once the service has been used. However, if you haven't used any premium features (AI Insights, Invoice Studio, Team Hub) within 48 hours of purchase, you may request a full refund.</p>
    
    <h2 className="text-2xl mt-8 mb-4">3. Processing Time</h2>
    <p>Approved refunds are processed within 5-7 business days and will be credited back to your original payment method.</p>
  </PolicyLayout>
);

export const TermsOfService: React.FC<PolicyProps> = ({ onBack }) => (
  <PolicyLayout title="Terms of Service" icon={<Scale size={32} />} onBack={onBack}>
    <h2 className="text-2xl mt-8 mb-4">1. Acceptable Use</h2>
    <p>SMEGenie is a professional utility. You agree not to use the platform for creating fraudulent or misleading financial or administrative documents. Misuse of AI credits or attempting to bypass rate limits will result in account suspension.</p>
    
    <h2 className="text-2xl mt-8 mb-4">2. Account Responsibility</h2>
    <p>You are responsible for maintaining the confidentiality of your login credentials. Enterprise account owners are responsible for the actions of their added team members.</p>
    
    <h2 className="text-2xl mt-8 mb-4">3. Limitation of Liability</h2>
    <p>SMEGenie provides professional tools but does not guarantee third-party approval for any generated document. We are not liable for any financial or professional consequences resulting from the use or misuse of our system.</p>
  </PolicyLayout>
);
