import { Transaction } from '@/types/fraud';
import { cn } from '@/lib/utils';
import { AlertTriangle, CreditCard, Smartphone, Building, Globe, ArrowUpRight } from 'lucide-react';

interface TickerProps {
  transactions: Transaction[];
}

const channelIcons = {
  card: CreditCard,
  upi: Smartphone,
  atm: Building,
  netbanking: Globe,
  wire: ArrowUpRight
};

export const SuspiciousTicker = ({ transactions }: TickerProps) => {
  return (
    <div className="glass-card overflow-hidden py-3">
      <div className="flex items-center gap-3 px-4 mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning animate-pulse" />
          <span className="text-xs font-semibold text-warning uppercase tracking-wider">
            Live Suspicious Activity
          </span>
        </div>
        <div className="live-indicator ml-auto">
          <span>Real-time</span>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="flex gap-4 animate-ticker hover:pause whitespace-nowrap">
          {[...transactions, ...transactions].map((tx, index) => {
            const Icon = channelIcons[tx.channel];
            const isHighRisk = tx.riskScore > 85;
            
            return (
              <div
                key={`${tx.id}-${index}`}
                className={cn(
                  'ticker-item flex items-center gap-3 flex-shrink-0 cursor-pointer',
                  'transition-all duration-200 hover:scale-105',
                  isHighRisk ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-lg',
                  isHighRisk ? 'bg-destructive/20' : 'bg-warning/20'
                )}>
                  <Icon className={cn(
                    'w-3.5 h-3.5',
                    isHighRisk ? 'text-destructive' : 'text-warning'
                  )} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">{tx.id}</span>
                  <span className="text-[10px] text-muted-foreground">{tx.location}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">${tx.amount.toLocaleString()}</span>
                  <div className={cn(
                    'text-[10px] font-medium',
                    isHighRisk ? 'text-destructive' : 'text-warning'
                  )}>
                    Risk: {tx.riskScore}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
