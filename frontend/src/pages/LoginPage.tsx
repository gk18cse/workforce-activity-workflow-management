import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Shield, Key, Mail, ArrowRight, Activity } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (switchDemoRole) {
      switchDemoRole(selectedRole);
    }
    navigate('/dashboard');
  };

  const selectDemoRole = (role: UserRole) => {
    setSelectedRole(role);
    const emails: Record<UserRole, string> = {
      ADMIN: 'admin@acme.com',
      MANAGER: 'manager@acme.com',
      EMPLOYEE: 'employee@acme.com',
    };
    setEmail(emails[role]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 items-center justify-center text-white shadow-xl shadow-indigo-600/30 font-black text-3xl mb-2">
            W
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            WorkflowPulse
          </h1>
          <p className="text-sm text-slate-400">
            Workforce Workflow & Operational Activity Management Platform
          </p>
        </div>

        {/* Quick Role Switcher for instant testing */}
        <Card className="border-indigo-500/30 bg-slate-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-indigo-400">
              <Shield className="w-4 h-4" /> Instant Demo Role Selector
            </CardTitle>
            <CardDescription className="text-xs">
              Select a role below to preview role-specific dashboards & RBAC permissions:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-2">
              {(['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => selectDemoRole(r)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                    selectedRole === r
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sign in Form */}
        <Card className="border-slate-800">
          <CardContent className="pt-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Sign In as {selectedRole} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
