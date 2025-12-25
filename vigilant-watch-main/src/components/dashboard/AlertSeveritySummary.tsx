import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface SeveritySummaryProps {
  high: number;
  medium: number;
  low: number;
}

export const AlertSeveritySummary = ({ high, medium, low }: SeveritySummaryProps) => {
  const total = high + medium + low;
  
  const items = [
    { label: 'High Risk', value: high, icon: AlertTriangle, color: 'destructive', percentage: (high / total) * 100 },
    { label: 'Medium Risk', value: medium, icon: AlertCircle, color: 'warning', percentage: (medium / total) * 100 },
    { label: 'Low Risk', value: low, icon: CheckCircle, color: 'success', percentage: (low / total) * 100 }
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold">Alert Severity</h3>
        <span className="text-xs text-muted-foreground">{total} total</span>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          const colorClass = {
            destructive: 'text-destructive bg-destructive/10',
            warning: 'text-warning bg-warning/10',
            success: 'text-success bg-success/10'
          }[item.color];
          
          const barColor = {
            destructive: 'bg-destructive',
            warning: 'bg-warning',
            success: 'bg-success'
          }[item.color];
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('p-1.5 rounded-lg', colorClass)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', barColor)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
