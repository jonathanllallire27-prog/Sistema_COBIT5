import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

interface AuditStatusChartProps {
  data?: ChartDataPoint[];
}

const AuditStatusChart: React.FC<AuditStatusChartProps> = ({ 
  data = [
    { name: 'Completadas', value: 12, fill: '#10b981' },
    { name: 'En Progreso', value: 5, fill: '#3b82f6' },
    { name: 'Planificadas', value: 8, fill: '#f59e0b' },
    { name: 'Canceladas', value: 2, fill: '#ef4444' },
  ]
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#f3f4f6'
          }}
        />
        <Legend />
        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AuditStatusChart;
