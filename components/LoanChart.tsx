
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AmortizationPeriod } from '../types';

interface LoanChartProps {
  data: AmortizationPeriod[];
}

export const LoanChart: React.FC<LoanChartProps> = ({ data }) => {
  // Sample the data if it's too large (e.g., 30 year loan has 360 points)
  const sampledData = data.filter((_, index) => index % (data.length > 120 ? 6 : 1) === 0);

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sampledData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            tick={{fontSize: 12, fill: '#94a3b8'}} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(val) => `Mo ${val}`}
          />
          <YAxis 
            tick={{fontSize: 12, fill: '#94a3b8'}} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
          />
          <Legend iconType="circle" />
          <Area 
            type="monotone" 
            dataKey="principal" 
            stroke="#4f46e5" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrincipal)" 
            name="Principal Component"
          />
          <Area 
            type="monotone" 
            dataKey="interest" 
            stroke="#ec4899" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorInterest)" 
            name="Interest Component"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
