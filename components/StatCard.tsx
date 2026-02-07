
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        {icon && <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">{icon}</div>}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
};
