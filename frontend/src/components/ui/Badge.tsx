import React from 'react';

export type BadgeVariant = 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'sky' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'indigo', children, className = '' }) => {
  const styles: Record<BadgeVariant, string> = {
    indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    sky: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-xs ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
