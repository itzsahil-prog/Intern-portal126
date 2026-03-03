
import React, { useState, useEffect, useMemo } from 'react';
import { User, Task, Submission, Application, Message, UserRole, SubmissionStatus, ApplicationStatus } from '../types';
import { db } from '../services/dbService';
import { 
  Users, 
  FileText, 
  Inbox, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  MoreVertical,
  Award,
  Star,
  Github,
  Server,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AVAILABLE_BADGES } from '../constants';

interface AdminDashboardProps {
  user: User;
  activePage: string;
  setActivePage: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activePage, setActivePage }) => {
  const [interns, setInterns] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<User | null>(null);

  useEffect(() => {
    setInterns(db.users.get().filter(u => u.role === UserRole.INTERN));
    setSubmissions(db.submissions.get());
    setApplications(db.applications.get());
    setMessages(db.messages.get());
  }, []);

  const stats = useMemo(() => ({
    interns: interns.length,
    submissions: submissions.length,
    pendingApps: applications.filter(a => a.status === ApplicationStatus.PENDING).length,
    pendingDoubts: messages.filter(m => m.status === 'pending').length
  }), [interns, submissions, applications, messages]);

  const handleReview = (e: React.FormEvent<HTMLFormElement>, status: SubmissionStatus) => {
    e.preventDefault();
    if (!selectedSub) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    const updated: Submission = {
      ...selectedSub,
      status,
      score: parseInt(formData.get('score') as string),
      remarks: formData.get('remarks') as string,
      reviewedAt: new Date().toISOString()
    };

    db.submissions.update(updated);
    setSubmissions(submissions.map(s => s.id === updated.id ? updated : s));
    setIsReviewModalOpen(false);
    toast.success(`Submission ${status} finalized.`);
  };

  const handleAcceptApp = (app: Application) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: app.fullName,
      email: app.email,
      password: 'password',
      role: UserRole.INTERN,
      createdAt: new Date().toISOString()
    };

    const users = db.users.get();
    db.users.save([...users, newUser]);
    const updatedApp: Application = { ...app, status: ApplicationStatus.ACCEPTED, reviewedAt: new Date().toISOString() };
    db.applications.update(updatedApp);
    setInterns([...interns, newUser]);
    setApplications(applications.map(a => a.id === app.id ? updatedApp : a));
    toast.success('Intern node initialized.');
  };

  const handleToggleBadge = (badgeId: string) => {
    if (!selectedIntern) return;
    const currentBadges = selectedIntern.badges || [];
    const updatedBadges = currentBadges.includes(badgeId)
      ? currentBadges.filter(id => id !== badgeId)
      : [...currentBadges, badgeId];
    
    const updatedUser = { ...selectedIntern, badges: updatedBadges };
    db.users.update(updatedUser);
    setSelectedIntern(updatedUser);
    setInterns(interns.map(i => i.id === updatedUser.id ? updatedUser : i));
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-950 p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Terminal size={160} className="float-icon" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-2">
            <Activity size={14} /> Main Server: veloxcodeagency@gmail.com
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none">Command Center<span className="text-blue-500">_</span></h1>
          <p className="text-slate-400 font-medium max-w-md text-lg">Administrator tier access authorized. All systems operational and syncing with main node.</p>
        </div>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="relative z-10 bg-white text-slate-950 px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-blue-600 hover:text-white hover:scale-105 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Broadcast Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Nodes', value: stats.interns, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Syncs', value: stats.submissions, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Queue Apps', value: stats.pendingApps, icon: Inbox, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Support Reqs', value: stats.pendingDoubts, icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover-lift group">
            <div className={`w-16 h-16 rounded-[1.5rem] ${stat.bg} ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              <stat.icon size={30} strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12">
        <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Review Pipeline</h3>
            <button onClick={() => setActivePage('submissions')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-xl">Full Node View</button>
          </div>
          <div className="space-y-6">
            {submissions.filter(s => s.status === SubmissionStatus.PENDING).slice(0, 4).map(sub => {
              const intern = interns.find(i => i.id === sub.userId);
              return (
                <div key={sub.id} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-transparent hover:border-blue-500 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group">
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tight">{sub.title}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                      <Zap size={10} className="text-blue-500" /> Origin: {intern?.name}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setSelectedSub(sub); setIsReviewModalOpen(true); }}
                    className="bg-white text-slate-950 border border-slate-200 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white transition-all active:scale-95 shadow-sm"
                  >
                    Analyze
                  </button>
                </div>
              );
            })}
            {submissions.filter(s => s.status === SubmissionStatus.PENDING).length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-emerald-500" size={32} />
                </div>
                <p className="text-slate-400 font-bold text-lg">All nodes synchronized.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Applicant Queue</h3>
            <button onClick={() => setActivePage('applications')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-xl">Manage Portal</button>
          </div>
          <div className="space-y-6">
            {applications.filter(a => a.status === ApplicationStatus.PENDING).slice(0, 4).map(app => (
              <div key={app.id} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-transparent hover:border-indigo-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-950 text-indigo-200 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl group-hover:scale-105 transition-transform">
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-black text-slate-900 leading-none">{app.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{app.email}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleAcceptApp(app)} className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm group-hover:shadow-lg">
                    <CheckCircle size={24} strokeWidth={2.5} />
                  </button>
                  <button className="p-4 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm group-hover:shadow-lg">
                    <XCircle size={24} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
            {applications.filter(a => a.status === ApplicationStatus.PENDING).length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Inbox className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 font-bold text-lg">Queue empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterns = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Node Directory</h2>
        <div className="relative group w-full md:w-[450px]">
          <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input placeholder="Search active nodes by ID or Name..." className="w-full pl-20 pr-10 py-6 bg-white border-2 border-slate-100 rounded-[2.5rem] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none font-bold shadow-2xl shadow-slate-900/5 transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {interns.map(intern => (
          <div key={intern.id} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all group duration-500 hover:-translate-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl border-8 border-slate-50 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {intern.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-2xl text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{intern.name}</h4>
                  <p className="text-xs text-slate-400 font-bold tracking-tight">{intern.email}</p>
                </div>
              </div>
              <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                <MoreVertical size={24} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 min-h-[40px]">
              {intern.badges?.map(badgeId => {
                const badge = AVAILABLE_BADGES.find(b => b.id === badgeId);
                return badge ? (
                  <span key={badgeId} className="px-4 py-2 rounded-2xl text-[10px] font-black border uppercase tracking-[0.1em] shadow-sm bg-white" style={{ color: badge.color, borderColor: badge.color }}>
                    {badge.icon} {badge.label.split(' ')[0]}
                  </span>
                ) : null;
              })}
              {(!intern.badges || intern.badges.length === 0) && (
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                   No honors synchronized
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-50">
              <button 
                onClick={() => { setSelectedIntern(intern); setIsBadgeModalOpen(true); }}
                className="flex items-center justify-center gap-2 py-5 rounded-[1.5rem] bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <Award size={18} /> Awards
              </button>
              <button className="flex items-center justify-center gap-2 py-5 rounded-[1.5rem] bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                Analysis
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {activePage === 'dashboard' && renderDashboard()}
      {activePage === 'interns' && renderInterns()}
      {activePage === 'submissions' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Sync Log</h2>
          <div className="grid gap-8">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 flex items-center justify-between hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-blue-500 transition-all group duration-500">
                <div className="space-y-4">
                  <h4 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-none">{sub.title}</h4>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {sub.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UID: {sub.userId}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedSub(sub); setIsReviewModalOpen(true); }}
                  className="bg-slate-950 text-white px-12 py-6 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 shadow-2xl shadow-slate-900/10 active:scale-95 transition-all"
                >
                  Deep Inspection
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reusable Modals (Task, Review, Badge) - No changes needed to their logic, but ensure they use the glass style */}
      {/* ... (Existing Modal implementation) ... */}

      {/* Task Modal (Stylized for perfection) */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-16">
              <h3 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">Broadcast Node Task<span className="text-blue-500">.</span></h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newTask: Task = {
                  id: Math.random().toString(36).substr(2, 9),
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  deadline: formData.get('deadline') as string,
                  maxScore: parseInt(formData.get('maxScore') as string),
                  createdAt: new Date().toISOString()
                };
                db.tasks.add(newTask);
                setIsTaskModalOpen(false);
                toast.success('Packet transmitted to all intern nodes.');
              }} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Protocol Header</label>
                  <input name="title" required className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-lg" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Points Threshold</label>
                    <input name="maxScore" type="number" defaultValue={100} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-lg" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sync Deadline</label>
                    <input name="deadline" type="datetime-local" required className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-lg" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mission Payload</label>
                  <textarea name="description" rows={5} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none resize-none font-medium focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
                </div>
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-6 border-2 border-slate-100 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all">Abort Broadcast</button>
                  <button type="submit" className="flex-1 py-6 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">Push to Hub</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedSub && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-3xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-16">
              <h3 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">Sync Inspection<span className="text-blue-500">.</span></h3>
              <div className="mb-12 p-12 bg-slate-950 text-white rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Activity size={140} className="float-icon" />
                </div>
                <div className="relative z-10 space-y-4">
                   <p className="text-3xl font-black leading-tight tracking-tight">{selectedSub.title}</p>
                   <p className="text-slate-400 font-medium leading-relaxed text-lg">{selectedSub.description}</p>
                   <div className="flex items-center gap-4 pt-4">
                     <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                       <Github size={24} className="text-blue-400" />
                     </div>
                     <a href={selectedSub.githubUrl} target="_blank" rel="noreferrer" className="text-base font-bold text-blue-400 hover:text-white transition-colors hover:underline">Commit History & Codebase</a>
                   </div>
                </div>
              </div>

              <form onSubmit={(e) => handleReview(e, SubmissionStatus.APPROVED)} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Assign Trust Score</label>
                  <input name="score" type="number" required placeholder="Scale 0-100" className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none font-black text-xl text-blue-600" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Node Performance Remarks</label>
                  <textarea name="remarks" rows={4} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none resize-none font-medium" />
                </div>
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={(e) => handleReview(e as any, SubmissionStatus.REJECTED)} className="flex-1 py-6 bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all">Flag Node</button>
                  <button type="submit" className="flex-2 py-6 px-16 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-emerald-500/10 hover:bg-emerald-700 active:scale-95 transition-all">Authorize Sync</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
