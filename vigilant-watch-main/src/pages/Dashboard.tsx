import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { SuspiciousTicker } from '@/components/dashboard/SuspiciousTicker';
import { FraudTrendChart } from '@/components/dashboard/FraudTrendChart';
import { FraudDonutChart } from '@/components/dashboard/FraudDonutChart';
import { AlertSeveritySummary } from '@/components/dashboard/AlertSeveritySummary';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionDetail } from '@/components/transactions/TransactionDetail';
import { Transaction } from '@/types/fraud';
import {
  mockKPIData,
  mockFraudTrend,
  mockTransactions,
  recentSuspiciousTransactions
} from '@/data/mockData';
import {
  Activity,
  AlertTriangle,
  Shield,
  TrendingDown
} from 'lucide-react';

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Fraud Detection Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring and analysis of suspicious transactions
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last updated:</span>
            <span className="font-medium text-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Suspicious Activity Ticker */}
        <SuspiciousTicker transactions={recentSuspiciousTransactions} />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Transactions"
            value={mockKPIData.totalTransactions}
            change={mockKPIData.changePercent.transactions}
            icon={Activity}
            variant="default"
          />
          <KPICard
            title="Flagged Transactions"
            value={mockKPIData.flaggedTransactions}
            change={mockKPIData.changePercent.flagged}
            icon={AlertTriangle}
            variant="warning"
          />
          <KPICard
            title="High-Risk Alerts"
            value={mockKPIData.highRiskAlerts}
            change={mockKPIData.changePercent.alerts}
            icon={Shield}
            variant="danger"
          />
          <KPICard
            title="Fraud Rate"
            value={`${mockKPIData.fraudRate}%`}
            change={mockKPIData.changePercent.fraudRate}
            icon={TrendingDown}
            variant="success"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FraudTrendChart data={mockFraudTrend} />
          </div>
          <div className="space-y-6">
            <FraudDonutChart fraudulent={1243} legitimate={155604} />
          </div>
        </div>

        {/* Alert Summary & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AlertSeveritySummary high={89} medium={234} low={156} />
          </div>
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <p className="text-sm text-muted-foreground">
                Latest transactions with risk assessment
              </p>
            </div>
            <TransactionsTable
              transactions={mockTransactions.slice(0, 20)}
              onViewTransaction={setSelectedTransaction}
            />
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
