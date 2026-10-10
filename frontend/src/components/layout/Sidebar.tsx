import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  GitBranch, 
  AlertTriangle, 
  History, 
  Users,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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

  const roleColors: Record<string, 'brand' | 'amber' | 'emerald'> = {
    ADMIN: 'brand',
    MANAGER: 'amber',
    EMPLOYEE: 'emerald',
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col justify-between h-screen sticky top-0 shrink-0 z-20 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-border flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-primary border border-border flex items-center justify-center text-primary-foreground font-sratome font-black text-base shadow-xs">
            W
          </div>
          <div>
            <h1 className="font-sratome font-extrabold text-xs tracking-wider uppercase text-foreground">
              WorkflowPulse
            </h1>
            <p className="text-[9px] font-sratome text-muted-foreground font-medium tracking-widest uppercase">
              Activity & Operations
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md font-sratome text-[11px] uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-secondary text-foreground border border-border font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Summary */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center font-sratome font-bold text-foreground text-xs shrink-0">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-sratome text-muted-foreground uppercase font-medium tracking-wider">Role:</span>
            <Badge variant={user?.roleEnum ? roleColors[user.roleEnum] : 'brand'}>
              {user?.roleEnum}
            </Badge>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center space-x-1 text-[10px] font-sratome uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-secondary border border-transparent hover:border-border"
          >
            <LogOut className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
