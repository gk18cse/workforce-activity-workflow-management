import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'flat' | 'raised' | 'inset';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const variantStyles = {
    default: 'bg-card border border-border/80 shadow-neu rounded-2xl',
    flat: 'bg-card border border-border/60 shadow-neu-sm rounded-2xl',
    raised: 'bg-card border border-border shadow-neu-raised rounded-2xl',
    inset: 'bg-background border border-border/70 shadow-neu-inset rounded-2xl',
  };

  return (
    <div
      className={`${variantStyles[variant]} p-5 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1 pb-3 border-b border-border/60 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-base font-sans font-bold tracking-tight text-foreground ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-muted-foreground font-sans ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`pt-4 ${className}`} {...props}>
    {children}
  </div>
);
