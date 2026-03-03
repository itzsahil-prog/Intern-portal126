
import React, { useState } from 'react';
import { User, UserRole, ApplicationStatus } from '../types';
import { db } from '../services/dbService';
import { toast } from 'react-hot-toast';
import { Lock, Mail, User as UserIcon, Github, Send, ShieldCheck, Server } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.INTERN);

  const [appName, setAppName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appPortfolio, setAppPortfolio] = useState('');
  const [appMessage, setAppMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.users.get();
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
      onLogin(user);
    } else {
      toast.error('Identity verification failed.');
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appPortfolio.includes('github.com')) {
      toast.error('Invalid Portfolio URL');
      return;
    }

    db.applications.add({
      id: Math.random().toString(36).substr(2, 9),
      fullName: appName,
      email: appEmail,
      portfolio: appPortfolio,
      message: appMessage,
      status: ApplicationStatus.PENDING,
      createdAt: new Date().toISOString()
    });

    toast.success('Transmission successful. Verification pending.');
    setIsLogin(true);
    setAppName(''); setAppEmail(''); setAppPortfolio(''); setAppMessage('');
  };

  return (
    <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-[0.2em] mb-4">
          <Server size={14} />
          Main Server: veloxcodeagency@gmail.com
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">VeloxCode<span className="text-blue-600">.</span></h1>
        <p className="text-slate-500 font-medium mt-2">Next-Gen Internship Management System</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        <div className="p-10">
          <div className="flex mb-10 bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${isLogin ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Access Portal
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
              New Application
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Token (Password)</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gateway Tier</label>
                <div className="relative">
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold appearance-none text-slate-700"
                  >
                    <option value={UserRole.INTERN}>Internship Gateway</option>
                    <option value={UserRole.ADMIN}>Administrative Terminal</option>
                  </select>
                  <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-950 hover:bg-blue-600 text-white font-bold py-5 rounded-[1.25rem] shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 group active:scale-95"
              >
                Establish Connection
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleApply} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  <input value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
                  <input value={appEmail} onChange={(e) => setAppEmail(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">GitHub Profile</label>
                <input value={appPortfolio} onChange={(e) => setAppPortfolio(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="github.com/..." required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skills / Brief</label>
                <textarea value={appMessage} onChange={(e) => setAppMessage(e.target.value)} rows={3} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-[1.25rem] shadow-xl shadow-blue-500/20 transition-all">
                Send Application to Server
              </button>
            </form>
          )}
        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs font-medium mt-8 flex items-center justify-center gap-2">
        <Server size={12} />
        Secure Server Host: <span className="font-bold text-slate-600">veloxcodeagency@gmail.com</span>
      </p>
    </div>
  );
};

export default LoginPage;
