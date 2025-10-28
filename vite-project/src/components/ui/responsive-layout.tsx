import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function ResponsiveContainer({ 
  children, 
  className = "",
  maxWidth = 'full'
}: ResponsiveContainerProps) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-full';
    }
  };

  return (
    <div className={`w-full ${getMaxWidthClass()} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ 
  title, 
  description, 
  className = "",
  actions 
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 ${className}`}>
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 truncate">{title}</h2>
        {description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 font-medium">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

interface GridLayoutProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GridLayout({ 
  children, 
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className = ""
}: GridLayoutProps) {
  const getGridCols = () => {
    const classes = [];
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    return classes.join(' ');
  };

  const getGap = () => {
    switch (gap) {
      case 'sm': return 'gap-3';
      case 'md': return 'gap-4 sm:gap-6';
      case 'lg': return 'gap-6 sm:gap-8';
      default: return 'gap-4 sm:gap-6';
    }
  };

  return (
    <div className={`grid ${getGridCols()} ${getGap()} ${className}`}>
      {children}
    </div>
  );
}

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileCard({ children, className = "" }: MobileCardProps) {
  return (
    <Card className={`lg:hidden ${className}`}>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

interface DesktopOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export function DesktopOnly({ children, className = "" }: DesktopOnlyProps) {
  return (
    <div className={`hidden lg:block ${className}`}>
      {children}
    </div>
  );
}

interface MobileOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileOnly({ children, className = "" }: MobileOnlyProps) {
  return (
    <div className={`lg:hidden ${className}`}>
      {children}
    </div>
  );
}