import React from 'react';
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
} from 'recharts';

const Charts: React.FC = () => {
  // Datos para gráfico de barras (Cumplimiento por dominio)
  const barData = [
    { name: 'EDM', cumplimiento: 92, meta: 100 },
    { name: 'APO', cumplimiento: 85, meta: 100 },
    { name: 'BAI', cumplimiento: 78, meta: 100 },
    { name: 'DSS', cumplimiento: 95, meta: 100 },
    { name: 'MEA', cumplimiento: 88, meta: 100 },
  ];

  // Datos para gráfico de pastel (Estado de auditorías)
  const pieData = [
    { name: 'Completadas', value: 8, color: '#10b981' },
    { name: 'En Progreso', value: 4, color: '#3b82f6' },
  ];

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-primary font-bold">
            {payload[0].value}% de cumplimiento
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {payload[0].value} auditorías
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Gráfico de barras - Cumplimiento por dominio */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Nivel de Cumplimiento por Dominio COBIT 5
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="cumplimiento"
                name="Cumplimiento (%)"
                fill="#135bec"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de pastel - Estado de auditorías */}
      <div className="bg-white dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Estado de Auditorías
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;