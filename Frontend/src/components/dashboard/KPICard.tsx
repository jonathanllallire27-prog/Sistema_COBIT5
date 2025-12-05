import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendColor?: string;
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendColor = 'text-green-600 dark:text-green-400',
  loading = false,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      
      {(description || trend) && !loading && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          {trend ? (
            <p className={clsx('text-xs flex items-center gap-1', trendColor)}>
              <span className="material-symbols-outlined text-base">trending_up</span>
              {trend}
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default KPICard;