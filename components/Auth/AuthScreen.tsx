
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ShieldCheck, Sparkles, ArrowRight, Loader2, ArrowLeft, Send, AlertTriangle, Database } from 'lucide-react';
import { UserProfile } from '../../types';
import { auth, db } from '../../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
  onBackToLanding: () => void;
  initialIsSignup?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBackToLanding, initialIsSignup = false }) => {
  const [isLogin, setIsLogin] = useState(!initialIsSignup);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const adminEmail = 'smegeniepro@gmail.com';

  useEffect(() => {
    setIsLogin(!initialIsSignup);
  }, [initialIsSignup]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      } catch (e: any) {
        if (e.message?.includes('database (default) does not exist')) {
          throw new Error("DB_NOT_FOUND");
        }
        throw e;
      }
      
      if (userDoc.exists()) {
        onLogin(userDoc.data() as UserProfile);
      } else {
        const isTargetAdmin = firebaseUser.email?.toLowerCase() === adminEmail;
        const newUser: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email || '',
          designation: isTargetAdmin ? 'Platform Administrator' : '',
          company: isTargetAdmin ? 'SMEGenie HQ' : '',
          role: isTargetAdmin ? 'SUPER_ADMIN' : 'USER',
          plan: isTargetAdmin ? 'ENTERPRISE' : 'FREE',
          joinedAt: Date.now(),
          status: 'ACTIVE',
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        onLogin(newUser);
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.message === "DB_NOT_FOUND") {
        setError(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><Database size={14} /> <span>Database Missing</span></div>
            <p className="font-medium text-[10px] opacity-80">Firestore is not initialized. Please create a database in the Firebase Console.</p>
          </div>
        );
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("Domain Not Authorized: Please add this URL to your Firebase Console > Authentication > Settings > Authorized Domains.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        // user closed popup
      } else {
        setError(err.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccessMsg("Reset link sent! Please check your inbox.");
      setIsForgotPassword(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        let userDoc;
        try {
          userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        } catch (e: any) {
           if (e.message?.includes('database (default) does not exist')) {
             throw new Error("DB_NOT_FOUND");
           }
           throw e;
        }
        
        if (userDoc.exists()) {
          onLogin(userDoc.data() as UserProfile);
        } else {
          const isTargetAdmin = userCredential.user.email?.toLowerCase() === adminEmail;
          const fallbackUser: UserProfile = {
            id: userCredential.user.uid,
            name: userCredential.user.displayName || 'User',
            email: userCredential.user.email || '',
            designation: isTargetAdmin ? 'Platform Administrator' : '',
            company: isTargetAdmin ? 'SMEGenie HQ' : '',
            role: isTargetAdmin ? 'SUPER_ADMIN' : 'USER',
            plan: isTargetAdmin ? 'ENTERPRISE' : 'FREE',
            joinedAt: Date.now(),
            status: 'ACTIVE'
          };
          onLogin(fallbackUser);
        }
      } else {
        if (!formData.name) throw new Error("Please enter your name");
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.name });

        const isTargetAdmin = formData.email.toLowerCase() === adminEmail;

        const newUser: UserProfile = {
          id: userCredential.user.uid,
          name: formData.name,
          email: formData.email,
          designation: isTargetAdmin ? 'Platform Administrator' : '',
          company: isTargetAdmin ? 'SMEGenie HQ' : '',
          role: isTargetAdmin ? 'SUPER_ADMIN' : 'USER',
          plan: isTargetAdmin ? 'ENTERPRISE' : 'FREE',
          joinedAt: Date.now(),
          status: 'ACTIVE',
        };

        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        } catch (e: any) {
          if (e.message?.includes('database (default) does not exist')) {
            throw new Error("DB_NOT_FOUND");
          }
          throw e;
        }
        onLogin(newUser);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "DB_NOT_FOUND") {
        setError(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><Database size={14} /> <span>Database Missing</span></div>
            <p className="font-medium text-[10px] opacity-80">Firestore is not initialized in the Firebase Console.</p>
          </div>
        );
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <button 
            onClick={() => setIsForgotPassword(false)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest mb-8 transition-colors self-start"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>

          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Reset Password</h2>
            <p className="text-sm text-slate-500 mb-8 font-medium">Enter your email and we'll send you a recovery link.</p>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex gap-3 items-start border border-red-100">
                  <AlertTriangle className="shrink-0" size={16} />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Send Reset Link <Send size={18} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest mb-8 transition-colors self-start"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-200 mx-auto mb-4">
            <Sparkles size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SMEGenie</h1>
          <p className="text-slate-500 font-medium italic">Professional Management Suite</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[9px] font-black text-blue-600 uppercase hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex gap-3 items-start border border-red-100">
                <AlertTriangle className="shrink-0" size={16} />
                <div className="flex-1">{error}</div>
              </div>
            )}
            {successMsg && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold text-center">{successMsg}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {isLogin ? 'Welcome Back' : 'Join the Tribe'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
             <div className="h-px bg-slate-100 flex-1"></div>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Or continue with</span>
             <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-10 text-center space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black text-blue-600 hover:underline transition-all"
            >
              {isLogin ? 'Register Now' : 'Sign In instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
