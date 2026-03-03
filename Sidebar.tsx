
import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  History, 
  Award, 
  MessageSquare, 
  User as UserIcon, 
  LogOut,
  Users,
  FileText,
  Inbox,
  Menu,
  ChevronLeft,
  Server,
  Activity
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  activePage, 
  setActivePage, 
  role, 
  onLogout 
}) => {
  const internLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'certificate', label: 'Certificate', icon: Award },
    { id: 'messages', label: 'Support', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const adminLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interns', label: 'Interns', icon: Users },
    { id: 'submissions', label: 'Submissions', icon: FileText },
    { id: 'applications', label: 'Applications', icon: Inbox },
    { id: 'doubts', label: 'Doubts', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const links = role === UserRole.INTERN ? internLinks : adminLinks;

  return (
    <div 
      className={`fixed left-0 top-0 bottom-0 glass-dark text-white transition-all duration-500 ease-in-out z-50 flex flex-col border-r border-white/5 ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Brand & Toggle */}
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="font-black text-xl tracking-tighter text-white">VeloxCode</h1>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'hover:bg-white/5' : 'mx-auto hover:bg-white/5 text-blue-400'}`}
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 py-8 px-3 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activePage === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'float-icon' : ''} />
              {isOpen && <span className="font-bold text-sm tracking-tight">{link.label}</span>}
              {isActive && !isOpen && (
                <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Server Status Footer */}
      <div className="p-4 border-t border-white/5 space-y-4">
        {isOpen && (
          <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Node</span>
              <div className="status-pulse" />
            </div>
            <p className="text-[10px] font-bold text-blue-400 truncate">veloxcodeagency@gmail.com</p>
          </div>
        )}
        
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-400 hover:bg-rose-400/10 transition-all duration-300 ${!isOpen && 'justify-center'}`}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-bold text-sm tracking-tight">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
