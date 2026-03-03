
import React, { useState, useEffect } from 'react';
import { User, Task, Submission, SubmissionStatus, Message } from '../types';
import { db } from '../services/dbService';
// Added Server to the lucide-react imports to fix 'Cannot find name Server' error
import { 
  CheckCircle, 
  Clock, 
  FileCheck, 
  Star, 
  Github, 
  Plus, 
  Calendar,
  Send,
  Download,
  Award,
  MessageSquare,
  Shield,
  Zap,
  Server
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AVAILABLE_BADGES } from '../constants';

interface InternDashboardProps {
  user: User;
  activePage: string;
  setActivePage: (page: string) => void;
  onUserUpdate: (user: User) => void;
}

const InternDashboard: React.FC<InternDashboardProps> = ({ user, activePage, setActivePage, onUserUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const stats = {
    total: tasks.length,
    completed: submissions.filter(s => s.status === SubmissionStatus.APPROVED).length,
    pending: submissions.filter(s => s.status === SubmissionStatus.PENDING).length,
    score: submissions.reduce((acc, curr) => acc + (curr.score || 0), 0)
  };

  useEffect(() => {
    setTasks(db.tasks.get());
    setSubmissions(db.submissions.get().filter(s => s.userId === user.id));
  }, [user.id]);

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      taskId: selectedTask.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      githubUrl: formData.get('githubUrl') as string,
      files: [],
      status: SubmissionStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    db.submissions.add(newSubmission);
    setSubmissions([...submissions, newSubmission]);
    setIsModalOpen(false);
    toast.success('Project deployed for review.');
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">
            <Zap size={12} className="fill-current" />
            Active Session
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Access Granted, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 font-semibold">Monitor your progress and manage deployments from the VeloxCode node.</p>
        </div>
        <div className="flex -space-x-2">
          {user.badges?.map(badgeId => {
            const badge = AVAILABLE_BADGES.find(b => b.id === badgeId);
            return badge ? (
              <div key={badgeId} className="w-12 h-12 rounded-2xl bg-white shadow-xl border-4 border-slate-50 flex items-center justify-center text-xl hover:-translate-y-2 transition-transform cursor-help" title={badge.label}>
                {badge.icon}
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Sync Tasks', value: stats.total, icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Deployed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'In Review', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Trust Score', value: stats.score, icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
              <stat.icon size={28} strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Assignments</h3>
            <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              Server Archive <Plus size={16} />
            </button>
          </div>

          <div className="grid gap-6">
            {tasks.map(task => {
              const submission = submissions.find(s => s.taskId === task.id);
              const isDeadlinePassed = new Date(task.deadline) < new Date();
              return (
                <div key={task.id} className="bg-white group p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden">
                  {submission?.status === SubmissionStatus.APPROVED && (
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full flex items-end justify-start p-6">
                      <CheckCircle className="text-emerald-500" size={20} />
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      <h4 className="text-2xl font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{task.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-xl">{task.description}</p>
                      <div className="flex flex-wrap gap-6 pt-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Calendar size={16} className="text-slate-300" />
                          EXP: {new Date(task.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Star size={16} className="text-amber-400" />
                          CAP: {task.maxScore} Pts
                        </div>
                      </div>
                    </div>
                    <div className="min-w-[160px]">
                      {submission ? (
                        <div className={`w-full py-4 px-6 rounded-2xl text-center border-2 font-black text-xs uppercase tracking-[0.2em] ${
                          submission.status === SubmissionStatus.APPROVED ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                          submission.status === SubmissionStatus.REJECTED ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                          {submission.status}
                        </div>
                      ) : (
                        <button 
                          disabled={isDeadlinePassed}
                          onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
                          className={`w-full py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${
                            isDeadlinePassed ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-950 text-white hover:bg-blue-600 shadow-blue-500/10 active:scale-95'
                          }`}
                        >
                          Push Work
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
              <Award size={200} />
            </div>
            <h4 className="text-2xl font-black mb-8 leading-tight tracking-tight">Certification Status</h4>
            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between mb-3 items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Node Completion</span>
                  <span className="text-2xl font-black">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full p-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(stats.completed / (stats.total || 1)) * 100}%` }}></div>
                </div>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Maintain a sync-rate of 100% and an average score of 70+ to unlock the final Agency Certificate.
              </p>
              <button 
                onClick={() => setActivePage('certificate')}
                className="w-full bg-white text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-95"
              >
                Inspect Credentials
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-8">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Agency Server</h4>
            <div className="space-y-4">
              {[
                { label: 'Documentation', icon: FileCheck, color: 'text-blue-500' },
                { label: 'Agency Assets', icon: Github, color: 'text-indigo-500' },
                { label: 'Protocol Specs', icon: Clock, color: 'text-rose-500' },
              ].map((link, i) => (
                <button key={i} className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all group border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white shadow-sm ${link.color}`}>
                      <link.icon size={20} />
                    </div>
                    <span className="font-bold text-slate-800">{link.label}</span>
                  </div>
                  <Plus size={16} className="text-slate-300 group-hover:rotate-90 transition-transform" />
                </button>
              ))}
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Server Email</p>
              <p className="text-xs font-bold text-slate-600">veloxcodeagency@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => {
    const userMessages = db.messages.get().filter(m => m.userId === user.id);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Support Terminal</h2>
          <div className="space-y-6">
            {userMessages.map(msg => (
              <div key={msg.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{msg.subject}</h4>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 inline-block">NODE-REF: {msg.id}</span>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${
                    msg.status === 'answered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-slate-600 font-medium bg-slate-50/50 p-6 rounded-3xl border border-slate-100 italic leading-relaxed">"{msg.message}"</p>
                {msg.answer && (
                  <div className="mt-8 p-8 rounded-3xl bg-blue-950 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Zap size={80} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Official Agency Response</p>
                      <p className="text-slate-200 font-medium leading-relaxed">{msg.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {userMessages.length === 0 && (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                <MessageSquare className="mx-auto text-slate-200 mb-6" size={64} />
                <p className="text-slate-400 font-bold text-xl">No active support transmissions.</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 h-fit sticky top-32">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Open Support Node</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const newMsg: Message = {
              id: Math.random().toString(36).substr(2, 9),
              userId: user.id, userName: user.name, userEmail: user.email,
              subject: formData.get('subject') as string,
              type: formData.get('type') as any,
              message: formData.get('message') as string,
              status: 'pending',
              createdAt: new Date().toISOString()
            };
            db.messages.add(newMsg);
            form.reset();
            toast.success('Packet transmitted to veloxcodeagency@gmail.com');
          }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Header</label>
              <input name="subject" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Category</label>
              <select name="type" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold appearance-none">
                <option value="doubt">Technical Doubt</option>
                <option value="feedback">System Feedback</option>
                <option value="help">Protocol Assistance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transmission Data</label>
              <textarea name="message" required rows={5} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none resize-none font-medium" />
            </div>
            <button className="w-full bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-blue-600 transition-all active:scale-95">
              Sync to Server
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {activePage === 'dashboard' && renderDashboard()}
      {activePage === 'history' && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Transmission Logs</h2>
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Timestamp</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trust Index</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <p className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{sub.title}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {sub.id}</p>
                    </td>
                    <td className="px-10 py-8 text-center text-sm font-bold text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`font-black text-2xl ${sub.score ? 'text-blue-600' : 'text-slate-200'}`}>
                        {sub.score || '--'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                        sub.status === SubmissionStatus.APPROVED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        sub.status === SubmissionStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all">
                        <Download size={20} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activePage === 'messages' && renderMessages()}
      {activePage === 'certificate' && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-700 py-10">
          <div className="bg-white p-20 rounded-[4rem] border-[16px] border-slate-50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 -ml-32 -mt-32 rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 -mr-48 -mb-48 rounded-full"></div>
            <div className="relative z-10 space-y-16">
              <div className="space-y-6">
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter">VeloxCode Agency</h1>
                <div className="w-32 h-2 bg-gradient-to-r from-blue-600 to-indigo-500 mx-auto rounded-full"></div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Official Node Certification</p>
              </div>
              <div className="space-y-8">
                <p className="text-2xl font-medium text-slate-500">This digital credential is issued to</p>
                <h2 className="text-7xl font-black text-slate-900 italic tracking-tight">{user.name}</h2>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
                  for demonstrating exceptional competence in the <br/><strong>Full Stack Engineering Protocol</strong><br/> hosted at Node-01.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-20 pt-16 border-t border-slate-100 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="h-0.5 bg-slate-200 mb-6"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Director</p>
                </div>
                <div className="text-center">
                  <div className="h-0.5 bg-slate-200 mb-6"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agency Server Admin</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6">
            <button className="bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] px-10 py-5 rounded-[1.5rem] shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-4 active:scale-95">
              <Download size={20} /> Download PDF
            </button>
            <button className="bg-white text-slate-600 font-black text-xs uppercase tracking-[0.2em] px-10 py-5 rounded-[1.5rem] shadow-lg border border-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-4 active:scale-95">
              <Send size={20} /> Public Verification
            </button>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-14">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Deploy Submission</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <Server size={14} className="text-blue-500" /> Target: {selectedTask.title}
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmission} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Identifier</label>
                    <input name="title" required className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Repository Link</label>
                    <div className="relative group">
                      <Github className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input name="githubUrl" required className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deployment Manifest (Notes)</label>
                  <textarea name="description" required rows={4} className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 outline-none resize-none font-medium" />
                </div>
                <div className="flex gap-6 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-[1.5rem] border-2 border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Abort</button>
                  <button type="submit" className="flex-2 py-5 px-10 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">Initiate Push</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternDashboard;
