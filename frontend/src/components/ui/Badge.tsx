import React from 'react';

export type BadgeVariant = 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'sky' | 'purple' | 'brand';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'brand', children, className = '' }) => {
  const styles: Record<BadgeVariant, string> = {
    brand: 'bg-secondary text-foreground border-border',
    indigo: 'bg-secondary text-foreground border-border',
    emerald: 'bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-500/30',
    slate: 'bg-muted text-muted-foreground border-border',
    sky: 'bg-sky-500/10 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border-sky-500/30',
    purple: 'bg-purple-500/10 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm font-sratome text-[10px] font-bold tracking-wider uppercase border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
