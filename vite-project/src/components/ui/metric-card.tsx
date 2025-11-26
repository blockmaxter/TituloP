import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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



  return (
    <Card className={`relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
      <CardHeader className="relative pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className="space-y-2 sm:space-y-3">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            {value}
          </div>
          {(description || effectiveTrendValue) && (
            <div className="flex items-start justify-between gap-2">
              {description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium flex-1 leading-tight">{description}</p>
              )}
              {effectiveTrendValue && effectiveTrend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  effectiveTrend === 'up' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : effectiveTrend === 'down'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {getTrendIcon()}
                  <span>{effectiveTrendValue}</span>
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
    <div className={`grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr ${className}`}>
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
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-700';
    }
  };

  return (
    <Badge variant="outline" className={getStatusStyles()}>
      {children}
    </Badge>
  );
}