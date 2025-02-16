import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => (
  <div className={cn("animate-spin rounded-full border-b-2 border-indigo-600", className)} />
); 