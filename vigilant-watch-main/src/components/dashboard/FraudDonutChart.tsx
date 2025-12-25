import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartProps {
  fraudulent: number;
  legitimate: number;
}

export const FraudDonutChart = ({ fraudulent, legitimate }: DonutChartProps) => {
  const data = [
    { name: 'Legitimate', value: legitimate, color: 'hsl(142, 76%, 36%)' },
    { name: 'Fraudulent', value: fraudulent, color: 'hsl(0, 84%, 60%)' },
    { name: 'Flagged', value: Math.floor(fraudulent * 0.3), color: 'hsl(38, 92%, 50%)' }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-semibold">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Transaction Distribution</h3>
        <span className="text-xs text-muted-foreground">Today</span>
      </div>
      
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-6 mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
