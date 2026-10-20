import React from 'react';

export type BadgeVariant = 'brand' | 'teal' | 'success' | 'warning' | 'danger' | 'slate' | 'neutral' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'sky' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'brand', children, className = '' }) => {
  const styles: Record<BadgeVariant, string> = {
    brand: 'bg-[#176B6B]/10 text-[#176B6B] border-[#176B6B]/30',
    teal: 'bg-[#176B6B]/10 text-[#176B6B] border-[#176B6B]/30',
    success: 'bg-[#2E7D5E]/15 text-[#2E7D5E] border-[#2E7D5E]/30',
    emerald: 'bg-[#2E7D5E]/15 text-[#2E7D5E] border-[#2E7D5E]/30',
    warning: 'bg-[#C88A2E]/15 text-[#C88A2E] border-[#C88A2E]/30',
    amber: 'bg-[#C88A2E]/15 text-[#C88A2E] border-[#C88A2E]/30',
    danger: 'bg-[#C25B4E]/15 text-[#C25B4E] border-[#C25B4E]/30',
    rose: 'bg-[#C25B4E]/15 text-[#C25B4E] border-[#C25B4E]/30',
    slate: 'bg-muted text-muted-foreground border-border',
    neutral: 'bg-secondary text-muted-foreground border-border/80',
    indigo: 'bg-[#438A87]/15 text-[#176B6B] border-[#438A87]/30',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-400/30',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-sans text-[11px] font-semibold tracking-wide border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
