import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const KPICards: React.FC = () => {
  const kpis = [
    {
      title: 'Cumplimiento General',
      value: '92.5%',
      icon: TrendingUp,
      trend: '+5.2% vs. periodo anterior',
      trendColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Auditorías',
      value: '12',
      icon: Clock,
      description: '8 Completadas, 4 en Progreso',
    },
    {
      title: 'Acciones Abiertas',
      value: '8',
      icon: AlertCircle,
      trend: '2 Vencidas',
      trendColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Resolución Promedio',
      value: '14 días',
      icon: CheckCircle,
      description: 'Tiempo para cerrar acciones',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200/80 dark:border-gray-800/80"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            
            {kpi.trend ? (
              <p className={`text-xs flex items-center gap-1 mt-2 ${kpi.trendColor}`}>
                <TrendingUp className="h-3 w-3" />
                {kpi.trend}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {kpi.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;