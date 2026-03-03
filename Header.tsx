
import React from 'react';
import { User, UserRole } from '../types';
import { Bell, Search, User as UserIcon, Server, Menu } from 'lucide-react';

interface HeaderProps {
  user: User;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="h-24 glass flex items-center justify-between px-8 md:px-12 sticky top-0 z-40 border-b border-slate-200/50">
      <div className="flex items-center gap-6">
        {/* Toggle Button for Header context */}
        <button 
          onClick={toggleSidebar}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
        >
          <Menu size={20} className="group-hover:scale-110 transition-transform" />
        </button>

        <div className="hidden lg:flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
            {user.role === UserRole.ADMIN ? 'Command Terminal' : 'Intern Space'}
          </h2>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
            <div className="status-pulse scale-75" />
            Host: veloxcodeagency@gmail.com
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 md:gap-10">
        <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 group focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all duration-300">
          <Search size={18} className="text-slate-400 group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Search Main Node..." 
            className="bg-transparent border-none focus:outline-none text-sm font-semibold w-48 lg:w-64 text-slate-700" 
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-2xl transition-all relative">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-4 group cursor-pointer pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none mb-1.5">{user.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{user.role} Tier</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <UserIcon size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
