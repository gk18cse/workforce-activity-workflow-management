import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LogOut, Building, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-14 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 shrink-0 z-10">
      {/* Organization Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1 bg-secondary border border-border rounded-md text-xs">
          <Building className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-sratome font-bold uppercase tracking-wider text-[11px] text-foreground">
            {user?.organization?.name || 'Acme Enterprises'}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="font-sratome text-[10px] uppercase tracking-wider text-muted-foreground">{user?.department?.name || 'Operations'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        {switchDemoRole && (
          <div className="flex items-center space-x-1 bg-background border border-border p-1 rounded-md">
            <span className="text-[9px] font-sratome text-muted-foreground font-semibold px-2 flex items-center gap-1 uppercase tracking-wider">
              <Shield className="w-3 h-3 text-primary" /> Mode:
            </span>
            {(['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchDemoRole(r)}
                className={`px-2.5 py-0.5 text-[10px] font-sratome uppercase tracking-wider font-bold rounded transition-all ${
                  user?.roleEnum === r
                    ? 'bg-primary text-primary-foreground font-extrabold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Logout */}
        <Button variant="ghost" size="sm" onClick={handleLogout} title="Sign Out">
          <LogOut className="w-3.5 h-3.5 text-muted-foreground hover:text-rose-500 transition-colors" />
          <span className="hidden md:inline text-[11px]">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};
