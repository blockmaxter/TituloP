import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'gradient' | 'paper' | 'glass';
}

export function ResponsiveContainer({ 
  children, 
  className = "",
  maxWidth = 'full',
  padding = 'md',
  background = 'gradient'
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2 sm:p-4',
    md: 'p-4 sm:p-6 lg:p-8',
    lg: 'p-6 sm:p-8 lg:p-12',
    xl: 'p-8 sm:p-12 lg:p-16'
  };

  const backgroundClasses = {
    none: '',
    gradient: 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900',
    paper: 'bg-white dark:bg-gray-900',
    glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
  };

  return (
    <div className={cn(
      "min-h-screen w-full",
      backgroundClasses[background],
      className
    )}>
      <div className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding]
      )}>
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
}

export function SectionHeader({ 
  title, 
  description, 
  className = "",
  actions,
  size = 'md',
  gradient = true
}: SectionHeaderProps) {
  const sizeClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl lg:text-4xl',
    lg: 'text-3xl sm:text-4xl lg:text-5xl',
    xl: 'text-4xl sm:text-5xl lg:text-6xl'
  };

  const titleClass = cn(
    "font-bold tracking-tight",
    sizeClasses[size],
    gradient 
      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400"
      : "text-gray-900 dark:text-gray-100"
  );

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8",
      className
    )}>
      <div className="min-w-0 flex-1 space-y-2">
        <h1 className={titleClass}>{title}</h1>
        {description && (
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 font-medium max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex-shrink-0 flex items-center gap-2">
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
    '2xl'?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  autoFit?: boolean;
  minItemWidth?: string;
}

export function GridLayout({ 
  children, 
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className = "",
  autoFit = false,
  minItemWidth = '300px'
}: GridLayoutProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-10',
    '2xl': 'gap-10 sm:gap-12'
  };

  if (autoFit) {
    return (
      <div 
        className={cn(
          "grid",
          gapClasses[gap],
          className
        )}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
        }}
      >
        {children}
      </div>
    );
  }

  const gridColsClasses = [];
  if (cols.default) gridColsClasses.push(`grid-cols-${cols.default}`);
  if (cols.sm) gridColsClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) gridColsClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) gridColsClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) gridColsClasses.push(`xl:grid-cols-${cols.xl}`);
  if (cols['2xl']) gridColsClasses.push(`2xl:grid-cols-${cols['2xl']}`);

  return (
    <div className={cn(
      "grid",
      gridColsClasses.join(' '),
      gapClasses[gap],
      className
    )}>
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
    <div className={cn("lg:hidden", className)}>
      {children}
    </div>
  );
}

interface FlexLayoutProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  responsive?: boolean;
}

export function FlexLayout({
  children,
  className = "",
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  responsive = false
}: FlexLayoutProps) {
  const directionClass = responsive 
    ? (direction === 'row' ? 'flex-col sm:flex-row' : 'flex-row sm:flex-col')
    : (direction === 'row' ? 'flex-row' : 'flex-col');
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    xs: 'gap-1 sm:gap-2',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-6',
    xl: 'gap-6 sm:gap-8',
    '2xl': 'gap-8 sm:gap-10'
  };

  return (
    <div className={cn(
      'flex',
      directionClass,
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

interface StackProps {
  children: React.ReactNode;
  className?: string;
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  divider?: boolean;
}

export function Stack({ 
  children, 
  className = "",
  space = 'md',
  divider = false 
}: StackProps) {
  const spaceClasses = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-10'
  };

  return (
    <div className={cn(
      "flex flex-col",
      spaceClasses[space],
      divider && "divide-y divide-gray-200 dark:divide-gray-700",
      className
    )}>
      {children}
    </div>
  );
}

interface CenterProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  minHeight?: string;
}

export function Center({ 
  children, 
  className = "",
  maxWidth,
  minHeight = "50vh"
}: CenterProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        className
      )}
      style={{
        minHeight,
        maxWidth: maxWidth ? maxWidth : undefined
      }}
    >
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}