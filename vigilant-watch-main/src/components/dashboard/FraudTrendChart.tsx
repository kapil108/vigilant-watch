import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FraudTrendData } from '@/types/fraud';

interface TrendChartProps {
  data: FraudTrendData[];
}

export const FraudTrendChart = ({ data }: TrendChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}:</span>
              <span className="font-medium">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Fraud Trend Analysis</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}
            />
            <span className="text-xs text-muted-foreground">Legitimate</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: 'hsl(0, 84%, 60%)' }}
            />
            <span className="text-xs text-muted-foreground">Fraudulent</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: 'hsl(38, 92%, 50%)' }}
            />
            <span className="text-xs text-muted-foreground">Flagged</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="legitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="flaggedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="legitimate"
            name="Legitimate"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={2}
            fill="url(#legitGradient)"
          />
          <Area
            type="monotone"
            dataKey="flagged"
            name="Flagged"
            stroke="hsl(38, 92%, 50%)"
            strokeWidth={2}
            fill="url(#flaggedGradient)"
          />
          <Area
            type="monotone"
            dataKey="fraudulent"
            name="Fraudulent"
            stroke="hsl(0, 84%, 60%)"
            strokeWidth={2}
            fill="url(#fraudGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
