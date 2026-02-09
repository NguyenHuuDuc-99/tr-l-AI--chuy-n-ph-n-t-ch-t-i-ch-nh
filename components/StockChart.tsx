import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalPoint } from '../types';

interface Props {
  data: HistoricalPoint[];
  symbol: string;
}

export const StockChart: React.FC<Props> = ({ data, symbol }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl">
      <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
        <span className="text-emerald-400">{symbol.toUpperCase()}</span> 
        <span className="text-slate-500">Price History (6 Months)</span>
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
            />
            <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    borderRadius: '0.5rem',
                    color: '#f8fafc' 
                }}
                itemStyle={{ color: '#34d399' }}
            />
            <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
