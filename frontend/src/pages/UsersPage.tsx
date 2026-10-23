import React, { useMemo, useState } from 'react';
import { Search, UserCog, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { initialEmployees } from '../services/mockData';

export const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const users = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return initialEmployees;
    return initialEmployees.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email} ${user.role} ${user.department}`.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">Manage Users</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Review user accounts, roles, departments, and access status.</p>
        </div>
        <Badge variant="brand" className="w-fit px-3 py-1"><Users className="w-3.5 h-3.5 mr-1" />{users.length} Users</Badge>
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name, email, role, or department..."
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-secondary/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-bold">User</th>
                <th className="px-5 py-3 font-bold">Role</th>
                <th className="px-5 py-3 font-bold">Department</th>
                <th className="px-5 py-3 font-bold">Team</th>
                <th className="px-5 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{user.avatar}</span>
                      <span>
                        <span className="block text-xs font-bold text-foreground">{user.firstName} {user.lastName}</span>
                        <span className="block text-[11px] text-muted-foreground">{user.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><Badge variant={user.roleEnum === 'ADMIN' ? 'purple' : user.roleEnum === 'MANAGER' ? 'amber' : 'teal'}><UserCog className="w-3 h-3 mr-1" />{user.roleEnum}</Badge></td>
                  <td className="px-5 py-4 text-xs text-foreground">{user.department}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{user.team}</td>
                  <td className="px-5 py-4"><Badge variant={user.status === 'Active' ? 'emerald' : 'neutral'}>{user.status}</Badge></td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">No users match that search.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
