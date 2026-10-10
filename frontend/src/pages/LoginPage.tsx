import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Key, Mail, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { switchDemoRole } = useAuth();
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-foreground transition-colors">
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-md bg-primary border border-border items-center justify-center text-primary-foreground font-sratome font-black text-2xl mb-1 shadow-xs">
            W
          </div>
          <h1 className="text-2xl sm:text-3xl font-sratome font-bold tracking-wider uppercase text-foreground">
            WorkflowPulse
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Workforce Activity & Workflow Management System
          </p>
        </div>

        {/* Quick Role Switcher */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-sratome font-bold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-primary" /> Instant Demo Persona Selector
            </CardTitle>
            <CardDescription className="text-xs font-sans">
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
                  className={`px-3 py-2 rounded-md font-sratome text-xs font-bold uppercase tracking-wider transition-all border ${
                    selectedRole === r
                      ? 'bg-primary text-primary-foreground border-border shadow-xs'
                      : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sign in Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-sratome text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3.5 py-2 font-sratome text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-sratome text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-muted-foreground" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3.5 py-2 font-sratome text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Sign In as {selectedRole} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
