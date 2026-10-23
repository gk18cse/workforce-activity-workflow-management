import React from 'react';
import { Building2, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { initialEmployees } from '../services/mockData';

export const DepartmentsPage: React.FC = () => {
  const departments = Array.from(
    initialEmployees.reduce((groups, employee) => {
      const members = groups.get(employee.department) ?? [];
      members.push(employee);
      groups.set(employee.department, members);
      return groups;
    }, new Map<string, typeof initialEmployees>())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">Departments</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">View departments, team sizes, and assigned members.</p>
        </div>
        <Badge variant="brand" className="w-fit px-3 py-1">{departments.length} Departments</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {departments.map(([name, members]) => {
          const teams = Array.from(new Set(members.map((member) => member.team)));
          const lead = members.find((member) => member.roleEnum === 'MANAGER');
          const activeCount = members.filter((member) => member.status === 'Active').length;

          return (
            <Card key={name}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>{name}</CardTitle>
                      <CardDescription>{teams.length} {teams.length === 1 ? 'team' : 'teams'}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="emerald">{activeCount} active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs py-3 border-y border-border/70">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Team members</span>
                  <span className="font-bold text-foreground">{members.length}</span>
                </div>
                <div className="pt-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Department lead</p>
                  {lead ? (
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center font-bold text-primary">{lead.avatar}</span>
                      <span>{lead.firstName} {lead.lastName}</span>
                    </div>
                  ) : <p className="text-xs text-muted-foreground">No lead assigned</p>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {teams.map((team) => <Badge key={team} variant="neutral">{team}</Badge>)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
