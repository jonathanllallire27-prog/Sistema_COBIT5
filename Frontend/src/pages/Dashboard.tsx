import React, { useEffect, useState } from 'react';
import KPICard from '@/components/dashboard/KPICard';
import ComplianceChart from '@/components/dashboard/ComplianceChart';
import AuditStatusChart from '@/components/dashboard/AuditStatusChart';
import { auditService } from '@/services/auditService';
import { DashboardMetrics } from '@/types';
import { 
  TrendingUp, 
  AlertCircle, 
  Clock,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await auditService.getDashboardMetrics();
      setMetrics(data);
      setLastUpdated(format(new Date(), "PPpp", { locale: es }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard de Auditorías
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Resumen general del estado de las auditorías y cumplimiento
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Actualizado: {lastUpdated}
          </span>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Cumplimiento General"
          value={`${metrics?.complianceRate?.toFixed(1) || '0'}%`}
          icon={BarChart3}
          trend="+5.2% vs periodo anterior"
          trendColor="text-green-600 dark:text-green-400"
        />
        <KPICard
          title="Auditorías Activas"
          value={metrics?.activeAudits?.toString() || '0'}
          icon={Clock}
          description={`${metrics?.totalAudits || 0} totales`}
        />
        <KPICard
          title="Hallazgos Abiertos"
          value={metrics?.openFindings?.toString() || '0'}
          icon={AlertCircle}
          trend={`${metrics?.totalFindings || 0} totales`}
          trendColor="text-orange-600 dark:text-orange-400"
        />
        <KPICard
          title="Score Promedio"
          value={metrics?.averageScore?.toFixed(1) || '0'}
          icon={TrendingUp}
          description="Sobre 5 puntos"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cumplimiento por Dominio
            </h2>
            <button className="flex items-center gap-2 text-sm text-primary hover:text-primary-600">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
          <ComplianceChart data={metrics?.complianceRate ? [
            { name: 'EDM', value: 92 },
            { name: 'APO', value: 85 },
            { name: 'BAI', value: 78 },
            { name: 'DSS', value: 95 },
            { name: 'MEA', value: 88 },
          ] : []} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Estado de Auditorías
          </h2>
          <AuditStatusChart
            data={[
              { name: 'Completadas', value: 8, fill: '#10b981' },
              { name: 'En Progreso', value: 4, fill: '#3b82f6' },
              { name: 'Planificadas', value: 2, fill: '#f59e0b' },
              { name: 'Canceladas', value: 1, fill: '#ef4444' },
            ]}
          />
        </div>
      </div>

      {/* Hallazgos por Severidad */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Hallazgos por Severidad
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(metrics?.findingsBySeverity || {}).map(([severity, count]) => (
            <div
              key={severity}
              className={`p-4 rounded-lg ${
                severity === 'critical'
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : severity === 'high'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                  : severity === 'medium'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {severity}
                </span>
                <span className={`text-2xl font-bold ${
                  severity === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : severity === 'high'
                    ? 'text-orange-600 dark:text-orange-400'
                    : severity === 'medium'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {count}
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    severity === 'critical'
                      ? 'bg-red-500'
                      : severity === 'high'
                      ? 'bg-orange-500'
                      : severity === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                  style={{
                    width: `${(count / (metrics?.totalFindings || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;