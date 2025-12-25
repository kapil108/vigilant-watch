import { Transaction, Alert, KPIData, FraudTrendData, RuleContribution, Channel, FraudStatus, RiskLevel } from '@/types/fraud';

const channels: Channel[] = ['card', 'upi', 'atm', 'netbanking', 'wire'];
const statuses: FraudStatus[] = ['flagged', 'confirmed', 'cleared', 'pending'];
const locations = ['New York, US', 'London, UK', 'Mumbai, IN', 'Singapore, SG', 'Dubai, UAE', 'Tokyo, JP', 'Sydney, AU', 'Frankfurt, DE', 'Hong Kong, HK', 'Toronto, CA'];
const merchantCategories = ['Retail', 'Gambling', 'Crypto Exchange', 'Travel', 'Electronics', 'Jewelry', 'Cash Advance', 'Wire Transfer', 'P2P Transfer', 'Online Shopping'];
const rules = [
  'Velocity Check Failed',
  'Unusual Location',
  'High-Value Transaction',
  'New Device Detected',
  'Cross-Border Transaction',
  'Time Anomaly',
  'Merchant Category Risk',
  'Account Age Risk',
  'Pattern Deviation',
  'Blacklisted Merchant'
];

const anomalies = [
  'Spending spike detected',
  'Unusual transaction time',
  'Geographic impossibility',
  'Device fingerprint mismatch',
  'Behavioral anomaly',
  'Network risk signal'
];

export const generateTransactions = (count: number): Transaction[] => {
  return Array.from({ length: count }, (_, i) => {
    const riskScore = Math.floor(Math.random() * 100);
    const fraudStatus = riskScore > 80 ? 'flagged' : riskScore > 60 ? 'pending' : riskScore > 40 ? 'cleared' : statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `TXN-${(100000 + i).toString()}`,
      accountId: `ACC-${(10000 + Math.floor(Math.random() * 90000)).toString()}`,
      amount: Math.floor(Math.random() * 50000) + 100,
      currency: 'USD',
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
      location: locations[Math.floor(Math.random() * locations.length)],
      country: locations[Math.floor(Math.random() * locations.length)].split(', ')[1],
      channel: channels[Math.floor(Math.random() * channels.length)],
      merchantCategory: merchantCategories[Math.floor(Math.random() * merchantCategories.length)],
      riskScore,
      fraudStatus,
      triggeredRules: riskScore > 50 ? rules.slice(0, Math.floor(Math.random() * 4) + 1) : [],
      anomalyIndicators: riskScore > 70 ? anomalies.slice(0, Math.floor(Math.random() * 3) + 1) : []
    };
  });
};

export const generateAlerts = (count: number): Alert[] => {
  return Array.from({ length: count }, (_, i) => {
    const riskScore = Math.floor(Math.random() * 40) + 60;
    const riskLevel: RiskLevel = riskScore > 85 ? 'high' : riskScore > 70 ? 'medium' : 'low';
    
    return {
      id: `ALT-${(1000 + i).toString()}`,
      transactionId: `TXN-${(100000 + Math.floor(Math.random() * 1000)).toString()}`,
      riskLevel,
      riskScore,
      triggeredRules: rules.slice(0, Math.floor(Math.random() * 3) + 1),
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      channel: channels[Math.floor(Math.random() * channels.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      amount: Math.floor(Math.random() * 25000) + 500,
      status: 'new'
    };
  });
};

export const mockKPIData: KPIData = {
  totalTransactions: 156847,
  flaggedTransactions: 1243,
  highRiskAlerts: 89,
  fraudRate: 0.79,
  changePercent: {
    transactions: 12.5,
    flagged: -8.3,
    alerts: 15.2,
    fraudRate: -2.1
  }
};

export const mockFraudTrend: FraudTrendData[] = [
  { date: '00:00', fraudulent: 12, legitimate: 2340, flagged: 45 },
  { date: '04:00', fraudulent: 8, legitimate: 1890, flagged: 32 },
  { date: '08:00', fraudulent: 23, legitimate: 4560, flagged: 78 },
  { date: '12:00', fraudulent: 34, legitimate: 6780, flagged: 112 },
  { date: '16:00', fraudulent: 28, legitimate: 5430, flagged: 89 },
  { date: '20:00', fraudulent: 19, legitimate: 3210, flagged: 56 },
];

export const mockRuleContributions: RuleContribution[] = [
  { rule: 'Velocity Check Failed', count: 342, percentage: 28 },
  { rule: 'Unusual Location', count: 287, percentage: 23 },
  { rule: 'High-Value Transaction', count: 198, percentage: 16 },
  { rule: 'Cross-Border Transaction', count: 156, percentage: 13 },
  { rule: 'New Device Detected', count: 134, percentage: 11 },
  { rule: 'Other Rules', count: 126, percentage: 9 },
];

export const mockTransactions = generateTransactions(100);
export const mockAlerts = generateAlerts(25);

export const recentSuspiciousTransactions = mockTransactions
  .filter(t => t.riskScore > 70)
  .slice(0, 10)
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
