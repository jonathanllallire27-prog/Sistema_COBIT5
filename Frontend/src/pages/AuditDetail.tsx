import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAudit } from '@/hooks/useAudit';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/helpers';

const AuditDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { audit, findings, loading } = useAudit(id ? parseInt(id) : undefined);

  const goToAudits = () => {
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate('/audits');
    } catch {
      navigate('/audits');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!audit) {
    return (
      <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Auditoría no encontrada
          </h3>
          <Button onClick={goToAudits} variant="outline">
            Volver a Auditorías
          </Button>
        </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      planned: 'Planeada',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return statusMap[status] || status;
  };

  const criticalFindings = findings.filter(f => f.severity === 'critical').length;
  const highFindings = findings.filter(f => f.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/audits')}
            icon={ArrowLeft}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {audit.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(audit.status)}`}>
                {getStatusText(audit.status)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ID: {audit.id}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/audits/${audit.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/execution/${audit.id}`)}
          >
            Continuar Ejecución
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fecha Inicio</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {audit.start_date ? formatDate(audit.start_date) : 'No definida'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <User className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Creador</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {audit.creator?.name || 'No asignado'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hallazgos Críticos</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {criticalFindings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hallazgos Altos</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {highFindings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Descripción
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {audit.description || 'No hay descripción disponible.'}
        </p>
      </div>

      {/* Process Scope */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Procesos en Alcance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {audit.scope_processes?.map((processId, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Proceso #{processId}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Descripción del proceso...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Findings */}
      {findings.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hallazgos Recientes
            </h2>
            <Button
              variant="outline"
              onClick={() => navigate(`/audits/${audit.id}/findings`)}
            >
              Ver Todos
            </Button>
          </div>
          <div className="space-y-3">
            {findings.slice(0, 3).map((finding) => (
              <div
                key={finding.id}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        finding.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        finding.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {finding.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {finding.Control?.control_code || 'Control no especificado'}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {finding.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {finding.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Riesgo: {finding.risk_score || finding.likelihood * finding.impact}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {finding.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(`/reports/audit/${audit.id}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generar Reporte
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/execution/${audit.id}`)}
        >
          {audit.status === 'completed' ? 'Ver Ejecución' : 'Continuar Ejecución'}
        </Button>
      </div>
    </div>
  );
};

export default AuditDetail;