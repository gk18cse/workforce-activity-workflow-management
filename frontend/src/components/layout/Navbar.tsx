import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ThemeToggle } from '../ui/ThemeToggle';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Bell, 
  HelpCircle, 
  Menu, 
  Shield, 
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  onToggleMobile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('This Month (Oct 2026)');
  const [searchQuery, setSearchQuery] = useState('');

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Task Approved', desc: 'Design System Tokens review was approved by Alex Vance', time: '10m ago', unread: true, type: 'success' },
    { id: '2', title: 'New Issue Reported', desc: 'API rate limiter blocking bulk sync reported by David', time: '45m ago', unread: true, type: 'warning' },
    { id: '3', title: 'Workflow Stage Advanced', desc: 'Q4 Product Launch moved to In Review stage', time: '2h ago', unread: true, type: 'info' },
    { id: '4', title: 'Approaching Deadline', desc: 'Quarterly compliance audit due tomorrow at 5:00 PM', time: '5h ago', unread: false, type: 'urgent' },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Compute page title and breadcrumbs
  const getPageMeta = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return { title: 'Operational Dashboard', section: 'Overview' };
    if (path.includes('tasks')) return { title: 'My Tasks & Execution', section: 'Workforce Operations' };
    if (path.includes('workforce')) return { title: 'Workforce Directory & Teams', section: 'People & Teams' };
    if (path.includes('activity')) return { title: 'Activity Traceability & Audit', section: 'Compliance' };
    if (path.includes('workflows')) return { title: 'Workflow & Process Boards', section: 'Operations' };
    if (path.includes('projects')) return { title: 'Enterprise Projects', section: 'Portfolio' };
    if (path.includes('calendar')) return { title: 'Team Calendar & Milestones', section: 'Scheduling' };
    if (path.includes('analytics')) return { title: 'Reports & Productivity Analytics', section: 'Intelligence' };
    if (path.includes('notifications')) return { title: 'Notifications Center', section: 'Alerts' };
    if (path.includes('settings')) return { title: 'System & Profile Settings', section: 'Administration' };
    return { title: 'WorkFlow Pro', section: 'Portal' };
  };

  const meta = getPageMeta();

  return (
    <>
      <header className="h-16 bg-card/90 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 shrink-0 z-20 shadow-neu-sm transition-colors">
        {/* Left: Mobile Toggle & Breadcrumb Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex flex-col">
            <div className="flex items-center text-[11px] font-medium text-muted-foreground space-x-1.5">
              <span>Home</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
              <span>{meta.section}</span>
            </div>
            <h2 className="font-sans text-base font-bold text-foreground tracking-tight">
              {meta.title}
            </h2>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, workflows, team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-neu-inset transition-all"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Date Selector Dropdown */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-background border border-border/80 rounded-xl text-xs font-medium text-foreground hover:bg-secondary/60 shadow-neu-sm transition-all"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
              <span>{selectedDateRange}</span>
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-neu p-1 z-30">
                {['Today', 'This Week', 'This Month (Oct 2026)', 'Q4 2026', 'Year to Date'].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedDateRange(range);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      selectedDateRange === range ? 'bg-primary text-white font-semibold' : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher for demo */}
          {switchDemoRole && (
            <div className="hidden lg:flex items-center space-x-1 bg-background border border-border/80 p-1 rounded-xl shadow-neu-sm">
              <span className="text-[10px] font-bold text-muted-foreground uppercase px-1.5 flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary" /> Role:
              </span>
              {(['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchDemoRole(r)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                    user?.roleEnum === r
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-card border border-border/80 text-foreground hover:bg-secondary shadow-neu-sm transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Tray */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-neu-raised p-4 z-40">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-foreground">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-border/40 max-h-72 overflow-y-auto my-2">
                  {notifications.map((n) => (
                    <div key={n.id} className={`py-2.5 px-2 rounded-xl transition-colors ${n.unread ? 'bg-primary/5' : 'hover:bg-secondary/40'}`}>
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                          {n.type === 'urgent' && <Clock className="w-3.5 h-3.5 text-rose-600" />}
                          {n.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/notifications');
                  }}
                  className="w-full mt-2 py-2 text-center text-xs font-semibold text-primary hover:bg-secondary rounded-xl transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-card border border-border/80 text-foreground hover:bg-secondary shadow-neu-sm transition-all"
            title="Help & Shortcuts"
          >
            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Help & Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-neu-raised animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-foreground">WorkFlow Pro Quick Guide</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 py-4 text-xs text-muted-foreground">
              <div>
                <h5 className="font-bold text-foreground text-sm mb-1">Operational Navigation</h5>
                <p>Switch between Admin, Manager, and Employee personas using the Mode badge in the top bar to inspect role-based views.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-background p-3 rounded-2xl border border-border/60">
                <div>
                  <span className="font-semibold text-foreground">Kanban & List Views:</span>
                  <p>In Workflows and Tasks, toggle views to drag and move tasks across stages.</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Activity Traceability:</span>
                  <p>All state transitions are logged immutably with actor, timestamp, and previous state.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-primary text-white font-bold rounded-xl shadow-sm text-xs"
            >
              Got it, continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};
