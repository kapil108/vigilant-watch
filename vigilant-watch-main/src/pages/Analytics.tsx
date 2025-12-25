import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { mockRuleContributions } from '@/data/mockData';
import { Globe, Clock, TrendingUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const merchantCategoryData = [
  { category: 'Crypto Exchange', fraud: 342, color: 'hsl(0, 84%, 60%)' },
  { category: 'Gambling', fraud: 287, color: 'hsl(0, 84%, 65%)' },
  { category: 'Jewelry', fraud: 198, color: 'hsl(38, 92%, 50%)' },
  { category: 'Electronics', fraud: 156, color: 'hsl(38, 92%, 55%)' },
  { category: 'Wire Transfer', fraud: 134, color: 'hsl(142, 76%, 36%)' },
  { category: 'Cash Advance', fraud: 98, color: 'hsl(142, 76%, 40%)' },
];

const timePatternData = [
  { hour: '00:00', fraud: 23 },
  { hour: '02:00', fraud: 18 },
  { hour: '04:00', fraud: 12 },
  { hour: '06:00', fraud: 8 },
  { hour: '08:00', fraud: 15 },
  { hour: '10:00', fraud: 28 },
  { hour: '12:00', fraud: 42 },
  { hour: '14:00', fraud: 38 },
  { hour: '16:00', fraud: 45 },
  { hour: '18:00', fraud: 52 },
  { hour: '20:00', fraud: 48 },
  { hour: '22:00', fraud: 35 },
];

const geographicData = [
  { country: 'Nigeria', count: 342, riskLevel: 'high' },
  { country: 'Russia', count: 287, riskLevel: 'high' },
  { country: 'China', count: 198, riskLevel: 'medium' },
  { country: 'Brazil', count: 156, riskLevel: 'medium' },
  { country: 'India', count: 134, riskLevel: 'medium' },
  { country: 'United States', count: 98, riskLevel: 'low' },
  { country: 'United Kingdom', count: 67, riskLevel: 'low' },
  { country: 'Germany', count: 45, riskLevel: 'low' },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState<'rule' | 'anomaly'>('rule');

  const { data: anomalyStats, isLoading: isLoadingAnomaly } = useQuery({
    queryKey: ['anomaly-stats'],
    queryFn: api.getAnomalyStats,
    enabled: activeTab === 'anomaly',
  });

  const { data: geoData = [] } = useQuery({
    queryKey: ['geo-stats'],
    queryFn: api.getGeographicDistribution,
  });

  const { data: categoryData = [] } = useQuery({
    queryKey: ['category-stats'],
    queryFn: api.getFraudByCategory,
  });

  const { data: ruleData = [] } = useQuery({
    queryKey: ['rule-stats'],
    queryFn: api.getRuleContribution,
  });

  const { data: timeData = [] } = useQuery({
    queryKey: ['time-stats'],
    queryFn: api.getFraudTimePattern,
  });

  const { data: anomalyTypeData = [] } = useQuery({
    queryKey: ['anomaly-type-stats'],
    queryFn: api.getAnomalyDistribution,
    enabled: activeTab === 'anomaly',
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">
            Fraud cases: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Process category data to match chart expectation (add colors)
  const processedCategoryData = categoryData.map((item: any, index: number) => ({
    ...item,
    color: `hsl(${index * 40}, 84%, 60%)`
  }));

  // Process time data to ensure full 24h if API doesn't return all (API does return 24h keys, but check)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics & Insights</h1>
            <p className="text-sm text-muted-foreground">
              Deep dive into fraud patterns and trends (Live Data)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('rule')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
                activeTab === 'rule'
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
              )}
            >
              Rule-based
            </button>
            <button
              onClick={() => setActiveTab('anomaly')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
                activeTab === 'anomaly'
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
              )}
            >
              Anomaly-based
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'rule' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up">
            {/* Geographic Fraud Distribution */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold">Geographic Fraud Distribution</h3>
              </div>
              <div className="space-y-3">
                {geoData.length > 0 ? geoData.map((item: any) => (
                  <div key={item.country} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{item.country}</span>
                      <span className={cn(
                        'text-xs font-semibold',
                        item.risk_level === 'high' ? 'text-destructive' :
                          item.risk_level === 'medium' ? 'text-warning' : 'text-success'
                      )}>
                        {item.count} cases
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          item.risk_level === 'high' ? 'bg-destructive' :
                            item.risk_level === 'medium' ? 'bg-warning' : 'bg-success'
                        )}
                        style={{ width: `${(item.count / Math.max(...geoData.map((d: any) => d.count), 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No geographic data available</p>}
              </div>
            </div>

            {/* Fraud by Merchant Category */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold">Fraud by Merchant Category</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={processedCategoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="fraud_count" radius={[0, 4, 4, 0]}>
                    {processedCategoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rule Contribution (Deterministic Rules Only) */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Layers className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold">Rule-wise Fraud Contribution</h3>
              </div>
              <div className="flex gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={ruleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="percentage"
                      strokeWidth={0}
                    >
                      {ruleData.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${217 + index * 20}, ${70 - index * 5}%, ${50 + index * 5}%)`}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {ruleData.length > 0 ? ruleData.map((rule: any, index: number) => (
                    <div key={rule.rule} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(${217 + index * 20}, ${70 - index * 5}%, ${50 + index * 5}%)` }}
                      />
                      <span className="text-xs text-muted-foreground flex-1 truncate">{rule.rule}</span>
                      <span className="text-xs font-semibold">{rule.percentage}%</span>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No rules triggered yet</p>}
                </div>
              </div>
            </div>

            {/* Time of Day Pattern */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold">Time-of-Day Fraud Patterns</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={timeData}>
                  <defs>
                    <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="fraud_count"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    fill="url(#timeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
                <span>Peak hours: <span className="text-foreground font-medium">Dynamic</span></span>
                <span>Low activity: <span className="text-foreground font-medium">Dynamic</span></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Total Anomalies (All time)</h3>
                <p className="text-3xl font-bold">{anomalyStats?.total_anomalies || 0}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recent Anomalies (24h)</h3>
                <p className="text-3xl font-bold text-destructive">{anomalyStats?.recent_anomalies_24h || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Anomaly Trend */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold">Anomaly Trend (Last 24h)</h3>
                </div>
                {isLoadingAnomaly ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Loading data...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={anomalyStats?.series || []}>
                      <defs>
                        <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                      <XAxis
                        dataKey="timestamp"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(0, 84%, 60%)"
                        strokeWidth={2}
                        fill="url(#anomalyGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Anomaly Type Distribution */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold">Anomaly Types</h3>
                </div>
                <div className="flex flex-col gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={anomalyTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="percentage"
                        strokeWidth={0}
                      >
                        {anomalyTypeData.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${280 + index * 40}, ${70}%, ${60}%)`}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 gap-2">
                    {anomalyTypeData.length > 0 ? anomalyTypeData.map((rule: any, index: number) => (
                      <div key={rule.rule} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `hsl(${280 + index * 40}, ${70}%, ${60}%)` }}
                        />
                        <span className="text-xs text-muted-foreground flex-1 truncate max-w-[120px]" title={rule.rule}>{rule.rule}</span>
                        <div className="flex flex-col items-end min-w-[60px]">
                          <span className="text-xs font-bold">{rule.percentage}%</span>
                          <span className="text-[10px] text-muted-foreground">Avg Risk: {rule.avg_score}</span>
                        </div>
                      </div>
                    )) : <p className="text-center text-sm text-muted-foreground mt-4">No anomalies detected yet</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
