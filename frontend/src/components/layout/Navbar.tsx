import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { LogOut, Building, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
      {/* Organization Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-xs text-slate-300">
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">
            {user?.organization?.name || 'Acme Enterprises'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{user?.department?.name || 'Operations'}</span>
        </div>
      </div>

      {/* Right Controls: Role Switcher & Logout */}
      <div className="flex items-center space-x-4">
        {/* Quick Demo Role Switcher */}
        {switchDemoRole && (
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
            <span className="text-[11px] text-slate-400 font-medium px-2 flex items-center gap-1">
              <Shield className="w-3 h-3 text-indigo-400" /> Mode:
            </span>
            {(['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchDemoRole(r)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  user?.roleEnum === r
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}

        {/* User Info & Logout Button */}
        <Button variant="ghost" size="sm" onClick={logout} title="Sign Out">
          <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 transition-colors" />
          <span className="hidden md:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};
