import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sratome font-semibold tracking-wider uppercase rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-primary text-primary-foreground border border-border shadow-xs hover:opacity-90',
    secondary:
      'bg-secondary hover:bg-muted text-foreground border border-border',
    outline:
      'border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-transparent',
    danger:
      'bg-rose-950/40 dark:bg-rose-950/80 hover:bg-rose-900 text-rose-600 dark:text-rose-200 border border-rose-500/30',
    ghost:
      'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent',
    success:
      'bg-emerald-950/40 dark:bg-emerald-950/80 hover:bg-emerald-900 text-emerald-600 dark:text-emerald-200 border border-emerald-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5',
    md: 'px-4 py-2 text-[12px] gap-2',
    lg: 'px-5 py-2.5 text-[14px] gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
