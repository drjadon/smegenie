
import React, { useState, useEffect, useMemo } from 'react';
import { AppScreen, UserProfile, EmployerProfile, LeaveRequest, PlanType, LeaveBalance, ResumeData, TeamMember, AttendanceRecord, ExpenseClaim, Transaction, Invoice, CatalogItem, Holiday, EnterpriseRole, Announcement } from './types';
import { STORAGE_KEYS, DEFAULT_BALANCE, TYPE_MAPPING } from './constants';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProfileForm } from './components/ProfileForm';
import { LeaveRequestForm } from './components/LeaveRequestForm';
import { PreviewLetter } from './components/PreviewLetter';
import { PlanSelector } from './components/PlanSelector';
import { HistoryScreen } from './components/HistoryScreen';
import { PayMateHub } from './components/PayMate/PayMateHub';
import { ResumeMaker } from './components/Resume/ResumeMaker';
import { TeamManagement } from './components/TeamManagement';
import { SuperAdminDashboard } from './components/SuperAdmin/SuperAdminDashboard';
import { AuthScreen } from './components/Auth/AuthScreen';
import { AttendanceManager } from './components/PayMate/AttendanceManager';
import { LandingPage } from './components/Landing/LandingPage';
import { PrivacyPolicy, RefundPolicy, TermsOfService } from './components/Landing/PolicyPages';
import { ExpenseTracker } from './components/Enterprise/ExpenseTracker';
import { MyClaims } from './components/Claims/MyClaims';
import { InvoiceMaker } from './components/Enterprise/InvoiceMaker';
import { HolidayManager } from './components/Enterprise/HolidayManager';
import { AIAssistant } from './components/AI/AIAssistant';
import { AnnouncementManager } from './components/Announcements/AnnouncementManager';
import { Loader2, AlertCircle, Database, ExternalLink, RefreshCw } from 'lucide-react';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  collection, 
  query, 
  where, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const App: React.FC = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LANDING);
  const [profileInitialTab, setProfileInitialTab] = useState<'INFO' | 'SIGNATURE' | 'EMPLOYERS'>('INFO');
  const [initialIsSignup, setInitialIsSignup] = useState(false);

  // States
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [teamLeaveRequests, setTeamLeaveRequests] = useState<LeaveRequest[]>([]);
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [signature, setSignature] = useState<string>('');
  const [balance, setBalance] = useState<LeaveBalance>(DEFAULT_BALANCE);
  const [resumeData, setResumeData] = useState<ResumeData>({
    templateId: 'modern',
    personalInfo: { fullName: '', email: '', phone: '', location: '', website: '', summary: '' },
    experience: [],
    education: [],
    skills: []
  });
  const [currentRequest, setCurrentRequest] = useState<LeaveRequest | null>(null);

  // Auth Observer & Firestore Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unSubProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUser(data);
            if (data.signature) setSignature(data.signature);
            if (data.balance) setBalance(data.balance);
            if (data.resumeData) setResumeData(data.resumeData);
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email || '',
              designation: '',
              company: '',
              role: 'USER',
              plan: 'FREE',
              joinedAt: Date.now(),
              status: 'ACTIVE'
            });
          }
          setIsAuthLoading(false);
          setDbError(null);
        }, (error: any) => {
          console.error("Firestore Profile Error:", error);
          if (error.code === 'not-found' || error.message?.includes('database (default) does not exist')) {
            setDbError("DATABASE_MISSING");
          }
          setIsAuthLoading(false);
        });

        // Sync Data Collections Scoped by ownerId
        const collectionsToSync = [
          { key: 'team_members', setter: setTeamMembers },
          { key: 'attendance', setter: setAttendance },
          { key: 'claims', setter: setClaims },
          { key: 'transactions', setter: setTransactions },
          { key: 'invoices', setter: setInvoices },
          { key: 'catalog', setter: setCatalog },
          { key: 'holidays', setter: setHolidays },
          { key: 'announcements', setter: setAnnouncements },
          { key: 'leave_requests', setter: setTeamLeaveRequests },
          { key: 'user_history', setter: setHistory },
          { key: 'employers', setter: setEmployers },
        ];

        const syncCleanups = collectionsToSync.map(({ key, setter }) => {
          const q = query(collection(db, key), where('ownerId', '==', firebaseUser.uid));
          return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            setter(items as any);
          }, (err: any) => {
            if (err.code === 'not-found') setDbError("DATABASE_MISSING");
          });
        });

        if (screen === AppScreen.LANDING || screen === AppScreen.AUTH) {
          setScreen(AppScreen.DASHBOARD);
        }

        return () => {
          unSubProfile();
          syncCleanups.forEach(cb => cb());
        };
      } else {
        setIsAuthenticated(false);
        setUser(null);
        const publicScreens = [AppScreen.LANDING, AppScreen.AUTH, AppScreen.PRIVACY, AppScreen.REFUND, AppScreen.TERMS];
        if (!publicScreens.includes(screen)) {
          setScreen(AppScreen.LANDING);
        }
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [screen]);

  // Firestore Persistence Helpers
  const persistToFirestore = async (col: string, data: any) => {
    if (!user) return;
    try {
      const docId = data.id || Math.random().toString(36).substring(2);
      await setDoc(doc(db, col, docId), { ...data, ownerId: user.id });
    } catch (e: any) { 
      console.error("Persistence error", e);
      if (e.code === 'not-found') setDbError("DATABASE_MISSING");
    }
  };

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setScreen(AppScreen.DASHBOARD);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleNavigate = (target: AppScreen, params?: any) => {
    const publicScreens = [AppScreen.LANDING, AppScreen.AUTH, AppScreen.PRIVACY, AppScreen.REFUND, AppScreen.TERMS];
    
    if (!isAuthenticated && !publicScreens.includes(target)) {
       setScreen(AppScreen.AUTH);
       setInitialIsSignup(false);
       return;
    }

    if (target === AppScreen.AUTH) {
      setInitialIsSignup(!!params?.isSignup);
    } else if (target === AppScreen.PROFILE) {
      setProfileInitialTab(params?.tab || 'INFO');
    }

    setScreen(target);
    window.scrollTo(0, 0);
  };

  const myScopedClaims = useMemo(() => claims, [claims]);
  const myScopedInvoices = useMemo(() => invoices, [invoices]);
  const myScopedHolidays = useMemo(() => holidays, [holidays]);
  const myScopedAnnouncements = useMemo(() => announcements, [announcements]);
  const myScopedAttendance = useMemo(() => attendance, [attendance]);
  const myScopedLeaveRequests = useMemo(() => teamLeaveRequests, [teamLeaveRequests]);
  const myScopedTransactions = useMemo(() => transactions, [transactions]);
  const myTeam = useMemo(() => teamMembers, [teamMembers]);

  const handleAddMember = (m: Partial<TeamMember>) => persistToFirestore('team_members', m);
  const handleAddClaim = (c: ExpenseClaim) => persistToFirestore('claims', c);
  const handleAddTransaction = (t: Transaction) => persistToFirestore('transactions', t);
  const handleSaveInvoice = (i: Invoice) => persistToFirestore('invoices', i);
  const handleSaveHoliday = (h: Holiday) => persistToFirestore('holidays', h);
  const handleSaveAnnouncement = (a: Announcement) => persistToFirestore('announcements', a);
  const handleGenerate = (data: LeaveRequest) => {
    persistToFirestore('user_history', data);
    persistToFirestore('leave_requests', data);
    setCurrentRequest(data);
    handleNavigate(AppScreen.PREVIEW);
  };

  const renderScreen = () => {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Initializing Smart Suite...</p>
        </div>
      );
    }

    if (dbError === "DATABASE_MISSING") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Database size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Firestore Setup Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              The application backend (Firestore) has not been initialized yet for project <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">smegenie-c5bb5</code>.
            </p>
            
            <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> How to fix:
              </p>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal ml-4 font-bold">
                <li>Visit the Firebase Console.</li>
                <li>Go to <strong>Firestore Database</strong>.</li>
                <li>Click <strong>Create Database</strong>.</li>
                <li>Choose <strong>Native Mode</strong> and set the ID to <code className="text-indigo-600">(default)</code>.</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <a 
                href="https://console.firebase.google.com/project/smegenie-c5bb5/firestore" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
              >
                Open Firebase Console <ExternalLink size={14} />
              </a>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                <RefreshCw size={14} /> I've fixed it, reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    const publicScreens = [AppScreen.LANDING, AppScreen.AUTH, AppScreen.PRIVACY, AppScreen.REFUND, AppScreen.TERMS];
    if (!publicScreens.includes(screen) && !user) {
        return <LandingPage onNavigate={handleNavigate} />;
    }

    if (!publicScreens.includes(screen) && user) {
      switch(screen) {
        case AppScreen.DASHBOARD:
          return (
            <Dashboard 
              user={user} employerCount={employers.length} plan={user.plan || 'FREE'} balance={balance}
              onNavigate={handleNavigate} history={history} hasSignature={!!signature} claims={myScopedClaims}
              holidays={myScopedHolidays} announcements={myScopedAnnouncements}
            />
          );
        case AppScreen.PROFILE:
          return (
            <ProfileForm 
              data={user} onSave={(d) => updateDoc(doc(db, 'users', user.id), d as any)} plan={user.plan || 'FREE'}
              signature={signature} onSaveSignature={(sig) => { updateDoc(doc(db, 'users', user.id), { signature: sig }); setSignature(sig); }}
              initialTab={profileInitialTab} balance={balance} onUpdateBalance={(b) => updateDoc(doc(db, 'users', user.id), { balance: b })}
              employers={employers} onSaveEmployers={(e) => { e.forEach(emp => persistToFirestore('employers', emp)); }}
            />
          );
        case AppScreen.LEAVE_FORM:
          return (
            <LeaveRequestForm 
              onGenerate={handleGenerate} plan={user.plan || 'FREE'} balance={balance} employers={employers}
              hasSignature={!!signature} onNavigateToSignature={() => handleNavigate(AppScreen.SIGNATURE)} user={user}
            />
          );
        case AppScreen.PREVIEW:
          if (!currentRequest) return null;
          const emp = employers.find(e => e.id === currentRequest.employerId) || { companyName: 'Company', managerName: 'Manager', managerEmail: '', managerPhone: '', id: '' };
          return <PreviewLetter user={user} employer={emp} request={currentRequest} plan={user.plan || 'FREE'} signature={signature} />;
        case AppScreen.PLANS: return <PlanSelector currentPlan={user.plan || 'FREE'} onSelect={(p) => updateDoc(doc(db, 'users', user.id), { plan: p })} />;
        case AppScreen.HISTORY: 
          return <HistoryScreen history={history} onViewRequest={(r) => { setCurrentRequest(r); handleNavigate(AppScreen.PREVIEW); }} />;
        case AppScreen.PAYMATE:
          return (
            <PayMateHub 
              plan={user.plan || 'FREE'} history={history} user={user} teamMembers={myTeam} onRemoveMember={async (id) => await deleteDoc(doc(db, 'team_members', id))} onUpdateMember={(m) => persistToFirestore('team_members', m)}
              teamLeaveRequests={myScopedLeaveRequests} onUpdateTeamLeaveStatus={(id, s) => updateDoc(doc(db, 'leave_requests', id), { status: s })}
              claims={myScopedClaims} onUpdateClaimStatus={(id, s) => updateDoc(doc(db, 'claims', id), { status: s })} onAddClaim={handleAddClaim} onAddTransaction={handleAddTransaction}
            />
          );
        case AppScreen.RESUME_MAKER: return <ResumeMaker plan={user.plan || 'FREE'} data={resumeData} onSave={(d) => updateDoc(doc(db, 'users', user.id), { resumeData: d })} onNavigateToPlans={() => handleNavigate(AppScreen.PLANS)} />;
        case AppScreen.TEAM:
          return (
            <TeamManagement plan={user.plan || 'FREE'} teamMembers={myTeam} onAddMember={handleAddMember} onRemoveMember={(id) => deleteDoc(doc(db, 'team_members', id))} onUpdateMemberRole={(id, r) => updateDoc(doc(db, 'team_members', id), { enterpriseRole: r })} onNavigateToPlans={() => handleNavigate(AppScreen.PLANS)} />
          );
        case AppScreen.SUPER_ADMIN: return <SuperAdminDashboard currentUser={user} onUserUpdate={(u) => updateDoc(doc(db, 'users', u.id), u as any)} onSaveAnnouncement={handleSaveAnnouncement} onDeleteAnnouncement={(id) => deleteDoc(doc(db, 'announcements', id))} globalAnnouncements={announcements.filter(a => a.targetType === 'GLOBAL')} />;
        case AppScreen.ATTENDANCE:
          return <AttendanceManager teamMembers={myTeam} attendanceRecords={myScopedAttendance} onMarkAttendance={(mid, type) => persistToFirestore('attendance', { memberId: mid, type, date: new Date().toISOString() })} />;
        case AppScreen.EXPENSE_TRACKER:
          return <ExpenseTracker transactions={myScopedTransactions} onAddTransaction={handleAddTransaction} onRemoveTransaction={(id) => deleteDoc(doc(db, 'transactions', id))} />;
        case AppScreen.INVOICE_MAKER:
          return <InvoiceMaker user={user} invoices={myScopedInvoices} catalog={catalog} onUpdateCatalog={(c) => c.forEach(item => persistToFirestore('catalog', item))} onSave={handleSaveInvoice} onDelete={(id) => deleteDoc(doc(db, 'invoices', id))} onAddTransaction={handleAddTransaction} onUpdateUser={(u) => updateDoc(doc(db, 'users', u.id), u as any)} />;
        case AppScreen.HOLIDAY_MANAGER:
          return <HolidayManager holidays={myScopedHolidays} enterpriseId={user.enterpriseId || user.id} onSave={handleSaveHoliday} onDelete={(id) => deleteDoc(doc(db, 'holidays', id))} />;
        case AppScreen.AI_ASSISTANT:
          return <AIAssistant user={user} balance={balance} holidays={myScopedHolidays} history={history} />;
        case AppScreen.ANNOUNCEMENTS:
          return <AnnouncementManager user={user} announcements={myScopedAnnouncements} onSave={handleSaveAnnouncement} onDelete={(id) => deleteDoc(doc(db, 'announcements', id))} />;
        case AppScreen.MY_CLAIMS: 
          return <MyClaims user={user} claims={myScopedClaims} onAddClaim={handleAddClaim} />;
        default: return null;
      }
    }

    switch(screen) {
      case AppScreen.LANDING: return <LandingPage onNavigate={handleNavigate} />;
      case AppScreen.PRIVACY: return <PrivacyPolicy onBack={() => handleNavigate(AppScreen.LANDING)} />;
      case AppScreen.REFUND: return <RefundPolicy onBack={() => handleNavigate(AppScreen.LANDING)} />;
      case AppScreen.TERMS: return <TermsOfService onBack={() => handleNavigate(AppScreen.LANDING)} />;
      case AppScreen.AUTH: return <AuthScreen onLogin={handleLogin} onBackToLanding={() => handleNavigate(AppScreen.LANDING)} initialIsSignup={initialIsSignup} />;
      default: return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {isAuthenticated && user && ![AppScreen.LANDING, AppScreen.AUTH, AppScreen.PRIVACY, AppScreen.REFUND, AppScreen.TERMS].includes(screen) ? (
        <Layout 
          title={screen.replace('_', ' ')} 
          activeScreen={screen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          plan={user.plan || 'FREE'}
          balance={balance}
          user={user}
        >
          {renderScreen()}
        </Layout>
      ) : (
        renderScreen()
      )}
    </>
  );
};

export default App;
