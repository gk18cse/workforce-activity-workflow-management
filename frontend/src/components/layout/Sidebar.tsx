import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Activity, 
  GitBranch, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  Workflow,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare, badge: '5' },
    { label: 'Workforce', path: '/workforce', icon: Users },
    { label: 'Activity Tracking', path: '/activity', icon: Activity },
    { label: 'Workflows', path: '/workflows', icon: GitBranch },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Team Calendar', path: '/calendar', icon: Calendar },
    { label: 'Reports & Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: '4' },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const roleColors: Record<string, 'brand' | 'amber' | 'emerald'> = {
    ADMIN: 'brand',
    MANAGER: 'amber',
    EMPLOYEE: 'emerald',
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 transition-colors shadow-neu-sm">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                WorkFlow <span className="text-primary font-extrabold text-xs px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20">PRO</span>
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                Workforce & Operations
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-foreground group-hover:bg-primary/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Summary */}
      <div className="p-4 border-t border-border/80 bg-background/50">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center font-sans font-bold text-primary text-xs shrink-0 shadow-neu-sm">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="truncate flex-1">
            <p className="text-xs font-bold text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <Badge variant={user?.roleEnum ? roleColors[user.roleEnum] : 'brand'}>
              {user?.roleEnum || 'EMPLOYEE'}
            </Badge>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-600 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
