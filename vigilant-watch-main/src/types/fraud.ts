export type RiskLevel = 'high' | 'medium' | 'low';
export type FraudStatus = 'flagged' | 'confirmed' | 'cleared' | 'pending';
export type Channel = 'card' | 'upi' | 'atm' | 'netbanking' | 'wire';
export type AlertStatus = 'new' | 'reviewed' | 'escalated' | 'false_positive';

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  location: string;
  country: string;
  channel: Channel;
  merchantCategory: string;
  riskScore: number;
  fraudStatus: FraudStatus;
  triggeredRules: string[];
  anomalyIndicators: string[];
  isFlagged?: boolean;
}

export interface Alert {
  id: string;
  transactionId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  triggeredRules: string[];
  timestamp: Date;
  channel: Channel;
  location: string;
  amount: number;
  status: AlertStatus;
  assignedTo?: string;
}

export interface KPIData {
  totalTransactions: number;
  flaggedTransactions: number;
  highRiskAlerts: number;
  fraudRate: number;
  changePercent: {
    transactions: number;
    flagged: number;
    alerts: number;
    fraudRate: number;
  };
}

export interface FraudTrendData {
  date: string;
  fraudulent: number;
  legitimate: number;
  flagged: number;
}

export interface RuleContribution {
  rule: string;
  count: number;
  percentage: number;
}

export interface GeographicData {
  country: string;
  fraudCount: number;
  riskLevel: RiskLevel;
  coordinates: [number, number];
}
