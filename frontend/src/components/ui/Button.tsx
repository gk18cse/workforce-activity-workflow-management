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
    'inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const variants = {
    primary:
      'bg-primary hover:bg-[#125656] text-primary-foreground shadow-sm hover:shadow-md border border-primary/20',
    secondary:
      'bg-card hover:bg-muted text-foreground border border-border shadow-neu-sm hover:shadow-neu',
    outline:
      'border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-transparent hover:bg-card/50',
    danger:
      'bg-[#C25B4E] hover:bg-[#A84B3E] text-white shadow-sm',
    ghost:
      'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent',
    success:
      'bg-[#2E7D5E] hover:bg-[#25684E] text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5',
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
