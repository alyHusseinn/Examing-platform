import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  icon, 
  children, 
  className, 
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
        variant === 'primary' 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
          : variant === 'destructive'
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}; 