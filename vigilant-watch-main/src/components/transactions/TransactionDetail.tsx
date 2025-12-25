import { Transaction } from '@/types/fraud';
import { cn } from '@/lib/utils';
import { 
  X, 
  MapPin, 
  Clock, 
  CreditCard, 
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  Globe,
  User,
  DollarSign,
  Smartphone,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
}

const channelIcons = {
  card: CreditCard,
  upi: Smartphone,
  atm: Building,
  netbanking: Globe,
  wire: ArrowUpRight
};

export const TransactionDetail = ({ transaction, onClose }: TransactionDetailProps) => {
  const ChannelIcon = channelIcons[transaction.channel];
  const isHighRisk = transaction.riskScore > 80;
  const isMediumRisk = transaction.riskScore > 50 && transaction.riskScore <= 80;

  // Mock recent transactions
  const recentTransactions = [
    { id: 'TXN-100456', amount: 234, time: '2 min ago', risk: 'low' },
    { id: 'TXN-100455', amount: 1890, time: '15 min ago', risk: 'medium' },
    { id: 'TXN-100454', amount: 450, time: '1 hr ago', risk: 'low' },
    { id: 'TXN-100453', amount: 5600, time: '3 hr ago', risk: 'high' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className={cn(
              'p-3 rounded-xl',
              isHighRisk ? 'bg-destructive/10 text-destructive' :
              isMediumRisk ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
            )}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{transaction.id}</h2>
              <p className="text-sm text-muted-foreground">Transaction Details</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-6 p-6">
          {/* Left: Transaction Metadata */}
          <div className="space-y-6">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Transaction Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Amount
                  </span>
                  <span className="text-lg font-bold">${transaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Account
                  </span>
                  <span className="text-sm font-medium">{transaction.accountId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Timestamp
                  </span>
                  <span className="text-sm">{transaction.timestamp.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </span>
                  <span className="text-sm">{transaction.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <ChannelIcon className="w-4 h-4" /> Channel
                  </span>
                  <span className="text-sm capitalize">{transaction.channel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Merchant
                  </span>
                  <span className="text-sm">{transaction.merchantCategory}</span>
                </div>
              </div>
            </div>

            {/* Mini Timeline */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => (
                  <div 
                    key={tx.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg',
                      'bg-muted/30 border border-border/30',
                      tx.risk === 'high' && 'border-l-2 border-l-destructive',
                      tx.risk === 'medium' && 'border-l-2 border-l-warning'
                    )}
                  >
                    <div>
                      <span className="text-xs font-medium">{tx.id}</span>
                      <span className="text-xs text-muted-foreground block">{tx.time}</span>
                    </div>
                    <span className="text-sm font-semibold">${tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Risk Explanation */}
          <div className="space-y-6">
            {/* Risk Score */}
            <div className={cn(
              'glass-card p-5',
              isHighRisk && 'border-destructive/30',
              isMediumRisk && 'border-warning/30'
            )}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className={cn(
                  'w-4 h-4',
                  isHighRisk ? 'text-destructive' :
                  isMediumRisk ? 'text-warning' : 'text-success'
                )} />
                Risk Assessment
              </h3>
              
              <div className="text-center py-6">
                <div className={cn(
                  'text-5xl font-bold mb-2',
                  isHighRisk ? 'text-destructive' :
                  isMediumRisk ? 'text-warning' : 'text-success'
                )}>
                  {transaction.riskScore}%
                </div>
                <span className={cn(
                  'text-sm font-medium uppercase tracking-wider',
                  isHighRisk ? 'text-destructive' :
                  isMediumRisk ? 'text-warning' : 'text-success'
                )}>
                  {isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk'}
                </span>
              </div>

              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isHighRisk ? 'bg-gradient-to-r from-warning to-destructive' :
                    isMediumRisk ? 'bg-gradient-to-r from-success to-warning' : 
                    'bg-success'
                  )}
                  style={{ width: `${transaction.riskScore}%` }}
                />
              </div>
            </div>

            {/* Triggered Rules */}
            {transaction.triggeredRules.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-4">Triggered Rules</h3>
                <div className="flex flex-wrap gap-2">
                  {transaction.triggeredRules.map((rule, index) => (
                    <span 
                      key={index}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium',
                        'bg-destructive/10 text-destructive border border-destructive/30'
                      )}
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Anomaly Indicators */}
            {transaction.anomalyIndicators.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-4">Anomaly Indicators</h3>
                <div className="space-y-2">
                  {transaction.anomalyIndicators.map((indicator, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-warning/5 border border-warning/20"
                    >
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-sm">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-success hover:bg-success/90">
                Mark as Safe
              </Button>
              <Button className="flex-1 bg-destructive hover:bg-destructive/90">
                Confirm Fraud
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
