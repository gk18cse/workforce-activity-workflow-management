import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  Key, 
  Lock, 
  Save, 
  CheckCircle2, 
  Sliders, 
  Globe, 
  Users,
  Check
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'notifications' | 'security' | 'roles'>('profile');

  // Profile Form State
  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'Sarah',
    lastName: user?.lastName || 'Connor',
    email: user?.email || 'admin@acme.com',
    roleTitle: 'Principal Operations Director',
    timezone: 'UTC-05:00 Eastern Time',
    language: 'English (US)',
  });

  // Org Settings State
  const [org, setOrg] = useState({
    name: 'Acme Enterprises',
    slug: 'acme-corp',
    domain: 'acme.com',
    defaultDept: 'Engineering',
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailTaskAssigned: true,
    emailWorkflowApproved: true,
    emailDeadlineApproaching: true,
    desktopAlerts: true,
    weeklyDigest: false,
  });

  const handleSave = (section: string) => {
    showToast(
      'Settings Saved',
      `${section} preferences have been successfully updated.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
            System & Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure profile credentials, organizational defaults, notification rules, and role permission policies.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="teal">{user?.roleEnum || 'ADMIN'} Privileges</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar Tabs */}
        <Card className="p-3 lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {[
              { id: 'profile', label: 'User Profile', icon: User },
              { id: 'organization', label: 'Organization', icon: Building },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security & Auth', icon: Lock },
              { id: 'roles', label: 'Roles & Permissions', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3">
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>User Profile Settings</CardTitle>
                <CardDescription>Personal identification, contact email, and operational details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center font-bold text-primary text-xl shadow-neu-sm">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{profile.firstName} {profile.lastName}</h4>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                    <span className="text-[11px] text-primary font-semibold mt-1 inline-block">Active Operator</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                    >
                      <option value="UTC-05:00 Eastern Time">UTC-05:00 Eastern Time</option>
                      <option value="UTC-08:00 Pacific Time">UTC-08:00 Pacific Time</option>
                      <option value="UTC+00:00 London (GMT)">UTC+00:00 London (GMT)</option>
                      <option value="UTC+05:30 India (IST)">UTC+05:30 India (IST)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex justify-end">
                  <Button variant="primary" onClick={() => handleSave('Profile')} className="flex items-center gap-1.5 shadow-neu-sm">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ORGANIZATION SETTINGS */}
          {activeTab === 'organization' && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Configuration</CardTitle>
                <CardDescription>Enterprise tenant identity, workspace subdomain, and department defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={org.name}
                    onChange={(e) => setOrg({ ...org, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Workspace Slug</label>
                    <input
                      type="text"
                      value={org.slug}
                      onChange={(e) => setOrg({ ...org, slug: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Corporate Domain</label>
                    <input
                      type="text"
                      value={org.domain}
                      onChange={(e) => setOrg({ ...org, domain: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-border/60 flex justify-end">
                  <Button variant="primary" onClick={() => handleSave('Organization')} className="flex items-center gap-1.5 shadow-neu-sm">
                    <Save className="w-4 h-4" />
                    <span>Update Organization</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATION PREFERENCES */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Select which notifications and alerts you receive across channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'emailTaskAssigned', title: 'Task Assignment Notifications', desc: 'Notify immediately when tasks are assigned to you or your team' },
                  { key: 'emailWorkflowApproved', title: 'Workflow Stage Approvals', desc: 'Alert when approval gates require your review or are cleared' },
                  { key: 'emailDeadlineApproaching', title: 'Approaching Deadlines', desc: 'Send alerts 24 hours prior to target task completion dates' },
                  { key: 'desktopAlerts', title: 'Browser Real-time Desktop Alerts', desc: 'Receive instant alerts for blockers, issue reports, and mentions' },
                  { key: 'weeklyDigest', title: 'Weekly Productivity Digest', desc: 'Receive a Monday morning summary report of completed tasks' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3.5 bg-background border border-border/80 rounded-2xl shadow-neu-sm">
                    <div>
                      <h5 className="font-bold text-xs text-foreground">{item.title}</h5>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifications as any)[item.key]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-0 cursor-pointer"
                    />
                  </div>
                ))}
                <div className="pt-3 border-t border-border/60 flex justify-end">
                  <Button variant="primary" onClick={() => handleSave('Notifications')} className="flex items-center gap-1.5 shadow-neu-sm">
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SECURITY & AUTH */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security & Access Control</CardTitle>
                <CardDescription>Manage credentials, token expiry policies, and session authenticity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-4 bg-background border border-border/80 rounded-2xl shadow-neu-sm space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <h5 className="font-bold text-foreground">JWT Session Status</h5>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Your session is cryptographically authenticated with SHA-256 HMAC tokens. Tokens automatically expire after 24 hours.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h5 className="font-bold text-foreground text-sm">Update Password</h5>
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary shadow-neu-inset"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex justify-end">
                  <Button variant="primary" onClick={() => handleSave('Security')} className="flex items-center gap-1.5 shadow-neu-sm">
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ROLES & PERMISSIONS */}
          {activeTab === 'roles' && (
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
                <CardDescription>Permission rules matrix across Admin, Manager, and Employee tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border/80">
                      <tr>
                        <th className="p-3">Permission Area</th>
                        <th className="p-3 text-center">Admin</th>
                        <th className="p-3 text-center">Manager</th>
                        <th className="p-3 text-center">Employee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {[
                        { area: 'Manage Staff & Directory', admin: true, manager: false, employee: false },
                        { area: 'Create & Edit Workflows', admin: true, manager: true, employee: false },
                        { area: 'Approve Stage Transitions', admin: true, manager: true, employee: false },
                        { area: 'Create & Assign Tasks', admin: true, manager: true, employee: false },
                        { area: 'Execute & Complete Tasks', admin: true, manager: true, employee: true },
                        { area: 'View Activity Audit Trail', admin: true, manager: true, employee: true },
                        { area: 'Export Analytics Reports', admin: true, manager: true, employee: false },
                        { area: 'System Configuration', admin: true, manager: false, employee: false },
                      ].map((row) => (
                        <tr key={row.area} className="hover:bg-secondary/30">
                          <td className="p-3 font-semibold text-foreground">{row.area}</td>
                          <td className="p-3 text-center">
                            {row.admin ? <Check className="w-4 h-4 text-emerald-600 inline" /> : '—'}
                          </td>
                          <td className="p-3 text-center">
                            {row.manager ? <Check className="w-4 h-4 text-emerald-600 inline" /> : '—'}
                          </td>
                          <td className="p-3 text-center">
                            {row.employee ? <Check className="w-4 h-4 text-emerald-600 inline" /> : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

    </div>
  );
};
