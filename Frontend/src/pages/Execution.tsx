import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAudit } from '@/hooks/useAudit';
import ControlList from '@/components/execution/ControlList';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Execution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    audit,
    assessments,
    findings,
    loading,
    error,
    updateAssessment,
    refetch,
  } = useAudit(id ? parseInt(id) : undefined);

  const [activeTab, setActiveTab] = useState<'controls' | 'findings'>('controls');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !audit) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {error || 'Auditoría no encontrada'}
        </h3>
        <Button onClick={() => navigate('/audits')} variant="outline">
          Volver a Auditorías
        </Button>
      </div>
    );
  }

  const completedAssessments = assessments.filter(a => a.status === 'completed').length;
  const totalAssessments = assessments.length;
  const completionPercentage = totalAssessments > 0 
    ? Math.round((completedAssessments / totalAssessments) * 100) 
    : 0;

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
            <p className="text-gray-600 dark:text-gray-400">
              Ejecución de auditoría • {audit.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={refetch}
          >
            Actualizar
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/reports/audit/${audit.id}`)}
          >
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Progreso</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completionPercentage}%
              </p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#135bec"
                  strokeWidth="4"
                  strokeDasharray={`${completionPercentage}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Controles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedAssessments}/{totalAssessments}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hallazgos Críticos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {criticalFindings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hallazgos Altos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {highFindings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('controls')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'controls'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Controles ({totalAssessments})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('findings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'findings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Hallazgos ({findings.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'controls' ? (
        <ControlList
          assessments={assessments}
          onAssessmentChange={updateAssessment}
        />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hallazgos de Auditoría
            </h2>
            <Button
              variant="primary"
              onClick={() => navigate(`/audits/${audit.id}/findings/new`)}
            >
              Nuevo Hallazgo
            </Button>
          </div>
          
          {findings.length > 0 ? (
            <div className="space-y-4">
              {findings.map((finding) => (
                <div
                  key={finding.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          finding.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                          finding.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                          finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {finding.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {finding.Control?.control_code}
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
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {finding.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron hallazgos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Todos los controles han pasado la evaluación sin observaciones
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Execution;