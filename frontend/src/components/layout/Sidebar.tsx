import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  GitBranch, 
  AlertTriangle, 
  History, 
  ShieldAlert,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Workflows', path: '/workflows', icon: GitBranch },
    { label: 'Issues & Blockers', path: '/issues', icon: AlertTriangle },
    { label: 'Audit Trail', path: '/audit-log', icon: History },
  ];

  if (user?.roleEnum === 'ADMIN') {
    navItems.push({ label: 'Users & Roles', path: '/users', icon: Users });
  }

  const roleColors: Record<string, 'indigo' | 'amber' | 'emerald'> = {
    ADMIN: 'indigo',
    MANAGER: 'amber',
    EMPLOYEE: 'emerald',
  };

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-xl z-20">
      <div>
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-800/60 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-xl">
            W
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              WorkflowPulse
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
              Operations & Traceability
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-md shadow-indigo-600/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Summary */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Role:</span>
          <Badge variant={user?.roleEnum ? roleColors[user.roleEnum] : 'indigo'}>
            {user?.roleEnum}
          </Badge>
        </div>
      </div>
    </aside>
  );
};
