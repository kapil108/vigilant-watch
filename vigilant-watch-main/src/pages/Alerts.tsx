import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AlertCard } from '@/components/alerts/AlertCard';
import { Alert, AlertStatus } from '@/types/fraud';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, ArrowUp, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Alerts = () => {
  // Use local state for manual updates like "mark as reviewed" which are client-side only for now
  // In a real app, this would trigger a mutation.
  const { data: serverAlerts = [], isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: api.getAlerts,
  });

  // Merge server alerts with any local state if we were doing that, 
  // but for simplicity let's just use server alerts and map them to state 
  // ONLY when they load initially? No, that's complex.
  // For this demo, let's just display server alerts. 
  // Actions will just show toast for now as backend doesn't support status updates yet.

  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // In a real app we'd update server state.
  const handleMarkReviewed = (id: string) => {
    toast.success('Alert marked as reviewed (Demo Only)');
  };

  const handleEscalate = (id: string) => {
    toast.warning('Alert escalated to senior analyst (Demo Only)');
  };

  const handleFalsePositive = (id: string) => {
    toast.info('Marked as false positive (Demo Only)');
  };

  const filteredAlerts = serverAlerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.riskLevel === filter;
  });

  const alertCounts = {
    all: serverAlerts.length,
    high: serverAlerts.filter(a => a.riskLevel === 'high').length,
    medium: serverAlerts.filter(a => a.riskLevel === 'medium').length,
    low: serverAlerts.filter(a => a.riskLevel === 'low').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Alert Center</h1>
            <p className="text-sm text-muted-foreground">
              Review and manage fraud alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="live-indicator">Real-time updates</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'high', 'medium', 'low'] as const).map((level) => {
            const icons = {
              all: AlertTriangle,
              high: XCircle,
              medium: ArrowUp,
              low: CheckCircle
            };
            const Icon = icons[level];
            const colors = {
              all: 'border-primary/30 text-primary',
              high: 'border-destructive/30 text-destructive',
              medium: 'border-warning/30 text-warning',
              low: 'border-success/30 text-success'
            };

            return (
              <Button
                key={level}
                variant="outline"
                size="sm"
                onClick={() => setFilter(level)}
                className={cn(
                  'gap-2 transition-all',
                  filter === level ? colors[level] : 'border-border/50'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{level}</span>
                <span className="ml-1 text-xs opacity-70">({alertCounts[level]})</span>
              </Button>
            );
          })}
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkReviewed={handleMarkReviewed}
              onEscalate={handleEscalate}
              onFalsePositive={handleFalsePositive}
            />
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
            <p className="text-sm text-muted-foreground">
              No {filter !== 'all' ? filter + ' risk' : ''} alerts to display
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
