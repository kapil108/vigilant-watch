import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const KPICard = ({ title, value, change, icon: Icon, variant = 'default' }: KPICardProps) => {
  const variantStyles = {
    default: 'border-border/50 hover:border-primary/30',
    success: 'border-success/20 hover:border-success/40 glow-success',
    warning: 'border-warning/20 hover:border-warning/40 glow-warning',
    danger: 'border-destructive/20 hover:border-destructive/40 glow-danger'
  };

  const iconStyles = {
    default: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-destructive bg-destructive/10'
  };

  return (
    <div className={cn(
      'stat-card group animate-fade-up',
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              change >= 0 ? 'text-success' : 'text-destructive'
            )}>
              <span>{change >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(change)}% from yesterday</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
          iconStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
