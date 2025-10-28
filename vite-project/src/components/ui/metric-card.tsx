import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  change?: number; // Nuevo prop para cambio numérico
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  trend, 
  trendValue, 
  change,
  className = "" 
}: MetricCardProps) {
  // Si se proporciona change, convertir a trend y trendValue
  const effectiveTrend = trend || (change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : undefined);
  const effectiveTrendValue = trendValue || (change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : undefined);

  const getTrendIcon = () => {
    switch (effectiveTrend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />;
      case 'neutral':
        return <Minus className="h-3 w-3 text-slate-500 dark:text-slate-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (effectiveTrend) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
        return 'text-slate-500 dark:text-slate-400';
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 sm:space-y-2">
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
          {(description || effectiveTrendValue) && (
            <div className="flex items-center justify-between">
              {description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex-1 mr-2">{description}</p>
              )}
              {effectiveTrendValue && effectiveTrend && (
                <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-xs font-semibold">{effectiveTrendValue}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricGridProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricGrid({ children, className = "" }: MetricGridProps) {
  return (
    <div className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={getStatusStyles()}>
      {children}
    </Badge>
  );
}