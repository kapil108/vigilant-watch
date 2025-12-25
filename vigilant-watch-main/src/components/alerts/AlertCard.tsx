import { Alert } from '@/types/fraud';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowUp,
  X,
  Smartphone,
  Building,
  Globe,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertCardProps {
  alert: Alert;
  onMarkReviewed?: (id: string) => void;
  onEscalate?: (id: string) => void;
  onFalsePositive?: (id: string) => void;
}

const channelIcons = {
  card: CreditCard,
  upi: Smartphone,
  atm: Building,
  netbanking: Globe,

  wire: ArrowUpRight,
  online: Globe,
  pos: CreditCard
};

export const AlertCard = ({ alert, onMarkReviewed, onEscalate, onFalsePositive }: AlertCardProps) => {
  const ChannelIcon = channelIcons[alert.channel] || CreditCard;

  const riskStyles = {
    high: {
      container: 'border-destructive/30 hover:border-destructive/50',
      badge: 'risk-badge-high',
      glow: 'glow-danger',
      icon: 'text-destructive bg-destructive/10'
    },
    medium: {
      container: 'border-warning/30 hover:border-warning/50',
      badge: 'risk-badge-medium',
      glow: 'glow-warning',
      icon: 'text-warning bg-warning/10'
    },
    low: {
      container: 'border-success/30 hover:border-success/50',
      badge: 'risk-badge-low',
      glow: 'glow-success',
      icon: 'text-success bg-success/10'
    }
  };

  const styles = riskStyles[alert.riskLevel];

  return (
    <div className={cn(
      'glass-card p-5 transition-all duration-300 animate-fade-up',
      styles.container
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl', styles.icon)}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">{alert.transactionId}</h4>
            <p className="text-xs text-muted-foreground">Alert #{alert.id}</p>
          </div>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs font-semibold uppercase', styles.badge)}>
          {alert.riskLevel} Risk
        </span>
      </div>

      {/* Risk Score Meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Risk Score</span>
          <span className={cn(
            'text-sm font-bold',
            alert.riskLevel === 'high' ? 'text-destructive' :
              alert.riskLevel === 'medium' ? 'text-warning' : 'text-success'
          )}>
            {alert.riskScore}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              alert.riskLevel === 'high' ? 'bg-destructive' :
                alert.riskLevel === 'medium' ? 'bg-warning' : 'bg-success'
            )}
            style={{ width: `${alert.riskScore}%` }}
          />
        </div>
      </div>

      {/* Triggered Rules */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Triggered Rules</p>
        <div className="flex flex-wrap gap-2">
          {alert.triggeredRules.map((rule, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium border border-border/50"
            >
              {rule}
            </span>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {alert.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            {alert.location}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ChannelIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground capitalize">
            {alert.channel}
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold">${alert.amount.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border/50">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 h-8 text-xs bg-success/10 border-success/30 text-success hover:bg-success/20 hover:text-success"
          onClick={() => onMarkReviewed?.(alert.id)}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Reviewed
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 h-8 text-xs bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 hover:text-destructive"
          onClick={() => onEscalate?.(alert.id)}
        >
          <ArrowUp className="w-3.5 h-3.5" />
          Escalate
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 h-8 text-xs bg-muted/50 border-border/50 hover:bg-muted"
          onClick={() => onFalsePositive?.(alert.id)}
        >
          <X className="w-3.5 h-3.5" />
          False +
        </Button>
      </div>
    </div>
  );
};
