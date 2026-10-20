import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flag,
  User,
  X
} from 'lucide-react';
import { initialCalendarEvents, CalendarEvent } from '../services/mockData';

export const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '2026-10-21',
    time: '11:00 AM',
    type: 'deadline' as const,
    project: 'WorkFlow Pro 2.0 Modernization',
    assignee: 'David Miller',
    priority: 'high' as const,
  });

  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const getEventsForDay = (day: number) => {
    const dayStr = `2026-10-${day < 10 ? '0' + day : day}`;
    return events.filter((e) => {
      const matchesDate = e.date === dayStr;
      const matchesType = selectedEventType === 'all' || e.type === selectedEventType;
      return matchesDate && matchesType;
    });
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const created: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      project: newEvent.project,
      assignee: newEvent.assignee,
      priority: newEvent.priority,
    };

    setEvents([...events, created]);
    setIsAddEventModalOpen(false);
  };

  const typeBadges = {
    deadline: { bg: 'bg-[#C25B4E]/10 text-[#C25B4E] border-[#C25B4E]/30', label: 'Deadline' },
    milestone: { bg: 'bg-[#176B6B]/10 text-[#176B6B] border-[#176B6B]/30', label: 'Milestone' },
    activity: { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', label: 'Activity' },
    approval: { bg: 'bg-[#C88A2E]/10 text-[#C88A2E] border-[#C88A2E]/30', label: 'Approval' },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-neu">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-foreground tracking-tight">
            Team Calendar & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Schedule of task deadlines, sprint reviews, compliance milestones, and approval signoffs.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-background border border-border rounded-xl p-1 shadow-neu-sm text-xs font-semibold">
            {(['month', 'week', 'day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all ${
                  viewMode === m
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={() => setIsAddEventModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </Button>
        </div>
      </div>

      {/* Month Navigator & Type Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-foreground">October 2026</h2>
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded-lg border border-border bg-background hover:bg-secondary text-muted-foreground">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg border border-border bg-background hover:bg-secondary text-muted-foreground">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground font-semibold">Filter:</span>
            {['all', 'deadline', 'milestone', 'activity', 'approval'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all ${
                  selectedEventType === type
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-background text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Month Grid View */}
      {viewMode === 'month' && (
        <Card className="p-3 sm:p-5">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-muted-foreground pb-3 border-b border-border/80">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1 uppercase tracking-wider text-[11px]">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-2">
            {/* Blank offset for Thursday Oct 1st */}
            <div className="h-24 sm:h-28 bg-transparent" />
            <div className="h-24 sm:h-28 bg-transparent" />
            <div className="h-24 sm:h-28 bg-transparent" />
            <div className="h-24 sm:h-28 bg-transparent" />

            {monthDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === 20;

              return (
                <div
                  key={day}
                  className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                    isToday
                      ? 'bg-primary/5 border-primary shadow-neu-sm'
                      : 'bg-background border-border/70 hover:border-border hover:shadow-neu-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]'
                          : 'text-foreground'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] font-bold text-primary hidden sm:inline">
                        {dayEvents.length} items
                      </span>
                    )}
                  </div>

                  {/* Day Events Pills */}
                  <div className="space-y-1 overflow-y-auto max-h-16">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] truncate border block font-medium ${typeBadges[evt.type].bg}`}
                      >
                        {evt.time && <span className="mr-1 opacity-75">{evt.time}</span>}
                        {evt.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Week / Day View List Fallback */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">
              {viewMode === 'week' ? 'Scheduled This Week (Oct 18 - Oct 24, 2026)' : 'Today (Oct 20, 2026)'}
            </h3>
            <div className="space-y-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-4 bg-background border border-border/80 rounded-2xl shadow-neu-sm flex items-center justify-between cursor-pointer hover:border-primary transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{evt.title}</h4>
                      <p className="text-xs text-muted-foreground">{evt.project} • Assignee: {evt.assignee}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-foreground block">{evt.date} at {evt.time}</span>
                    <Badge variant={evt.priority === 'urgent' ? 'danger' : 'teal'}>{evt.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="font-bold text-base text-foreground">{selectedEvent.title}</h3>
                <span className="text-xs text-muted-foreground capitalize">{selectedEvent.type} Event</span>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs bg-background p-3.5 rounded-2xl border border-border/60">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled Date:</span>
                <span className="font-semibold text-foreground">{selectedEvent.date} {selectedEvent.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Related Project:</span>
                <span className="font-semibold text-foreground">{selectedEvent.project}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Responsible Assignee:</span>
                <span className="font-semibold text-foreground">{selectedEvent.assignee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority Level:</span>
                <Badge variant={selectedEvent.priority === 'urgent' ? 'danger' : 'teal'}>{selectedEvent.priority}</Badge>
              </div>
            </div>
            <Button variant="primary" onClick={() => setSelectedEvent(null)} className="w-full">
              Close Event
            </Button>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground">Schedule Calendar Event</h3>
              <button onClick={() => setIsAddEventModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddEventSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Token Signoff"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Time</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  >
                    <option value="deadline">Deadline</option>
                    <option value="milestone">Milestone</option>
                    <option value="activity">Activity</option>
                    <option value="approval">Approval</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Priority</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddEventModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
