import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { reportService } from '@/services/reportService';
import { auditService } from '@/services/auditService';
import api from '@/services/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type Metrics = {
  totalAudits?: number;
  activeAudits?: number;
  complianceRate?: number | string;
  totalFindings?: number;
  openFindings?: number;
  findingsBySeverity?: Record<string, number>;
  averageScore?: number | string;
  totalAssessments?: number;
  completedAssessments?: number;
};

const Reports: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '2024-09-05:2024-10-07',
    auditType: 'all',
    controlObjective: 'all',
    search: '',
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const [metrics, setMetrics] = useState<Metrics>({});
  const [loading, setLoading] = useState(false);
  const [reportsList, setReportsList] = useState<Array<{auditId: number; url?: string; error?: string}>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [jobProgress, setJobProgress] = useState<number | null>(null);
  const [creators, setCreators] = useState<Array<{id:number;name:string}>>([]);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      if (auditId) {
        // Obtener datos del reporte por auditoría
        const data = await reportService.getReportData(parseInt(auditId));
        setMetrics({
          totalAssessments: data.metrics?.totalAssessments,
          completedAssessments: data.metrics?.completedAssessments,
          complianceRate: data.metrics?.complianceRate,
          totalFindings: data.metrics?.totalFindings,
          findingsBySeverity: data.metrics?.findingsBySeverity,
          assessmentsByDomain: data.metrics?.assessmentsByDomain,
        } as any);
      } else {
        // Obtener métricas globales
        const global = await auditService.getDashboardMetrics();
        setMetrics(global as any);
      }
    } catch (err) {
      console.error('Error generando reporte:', err);
      alert('Error al generar el reporte. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // cargar lista de creadores para el filtro
    (async () => {
      try {
        const resp = await api.get('/users');
        setCreators((resp.data.data || []).map((u: any) => ({ id: u.id, name: u.name })));
      } catch (err) {
        console.error('Error cargando creadores:', err);
      }
    })();
  }, []);

  const { auditId } = useParams<{ auditId?: string }>();

  const handleDownloadAuditPdf = async () => {
    if (!auditId) return;
    try {
      const blob = await reportService.generateAuditReport(parseInt(auditId), 'pdf');
      const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `audit-report-${auditId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error descargando PDF:', err);
      alert('Error al generar el PDF. Revisa la consola.');
    }
  };

  useEffect(() => {
    // Si viene auditId por ruta, auto-cargar sus métricas
    if (auditId) {
      handleGenerateReport();
    } else {
      // cargar métricas globales iniciales
      (async () => {
        setLoading(true);
        try {
          const global = await auditService.getDashboardMetrics();
          setMetrics(global as any);
        } catch (err) {
          console.error('Error cargando métricas globales:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId]);

  const handleGenerateAllReports = async () => {
    setLoading(true);
    try {
      const results = await reportService.generateAllReports();
      setReportsList(results);
      alert('Generación completada. Revisa los enlaces abajo.');
    } catch (err) {
      console.error('Error generando todos los reportes:', err);
      alert('Error al generar reportes para todas las auditorías. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFiltered = async (all = false) => {
    setLoading(true);
    try {
      // Submit a background job instead of synchronous generation
      const payload: any = {};
      const [from, to] = filters.dateRange.split(':');
      if (from) payload.dateFrom = from;
      if (to) payload.dateTo = to;
      if (filters.auditType && filters.auditType !== 'all') payload.status = filters.auditType;
      if (filters.controlObjective && filters.controlObjective !== 'all') payload.controlObjective = filters.controlObjective;
      if ((filters as any).creatorId && (filters as any).creatorId !== 'all') payload.creatorId = Number((filters as any).creatorId);
      if (all) payload.all = true;

      const data = await reportService.submitReportJob(payload);
      const jobId = data.jobId;
      // Show job in UI while pending
      setReportsList([]);
      setJobProgress(0);
      // Poll job status every 2s
      const poll = setInterval(async () => {
        try {
          const status = await reportService.getJobStatus(jobId);
          // update display: if completed, show results
          if (status.status === 'completed') {
            setReportsList(status.result_urls || []);
            setJobProgress(100);
            clearInterval(poll);
            // reset progress after short delay
            setTimeout(() => setJobProgress(null), 2000);
            alert('Generación completa. Revisa los enlaces abajo.');
          } else if (status.status === 'failed') {
            clearInterval(poll);
            setJobProgress(null);
            alert('La generación falló: ' + (status.error || 'Error desconocido'));
          } else {
            // update progress indicator
            setJobProgress(status.progress ?? null);
          }
        } catch (err) {
          console.error('Error consultando job status:', err);
        }
      }, 2000);
    } catch (err) {
      console.error('Error generando reportes filtrados:', err);
      alert('Error al generar reportes filtrados. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Informes y Analíticas</h1>
        <p className="text-gray-600 dark:text-gray-400">Genere informes personalizados sobre el rendimiento y cumplimiento de las auditorías.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Buscar</label>
            <Input
              placeholder="Buscar por nombre de auditoría, id o descripción..."
              value={filters.search}
              onChange={(e: any) => handleFilterChange({ ...filters, search: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">Ingresa un término de búsqueda para filtrar auditorías</p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Fecha inicio</label>
                <Input
                  type="date"
                  value={(filters.dateRange || '').split(':')[0] || ''}
                  onChange={(e: any) => handleFilterChange({ ...filters, dateRange: `${e.target.value}:${(filters.dateRange || '').split(':')[1] || ''}` })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Fecha fin</label>
                <Input
                  type="date"
                  value={(filters.dateRange || '').split(':')[1] || ''}
                  onChange={(e: any) => handleFilterChange({ ...filters, dateRange: `${(filters.dateRange || '').split(':')[0] || ''}:${e.target.value}` })}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Filtrar auditorías por rango de fechas</p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Estado</label>
            <select
              value={filters.auditType}
              onChange={(e) => handleFilterChange({ ...filters, auditType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los estados</option>
              <option value="planned">Planeada</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>

            <label className="block text-sm text-gray-600 dark:text-gray-300 mt-4 mb-1">Creador</label>
            <select
              value={(filters as any).creatorId || 'all'}
              onChange={(e) => handleFilterChange({ ...filters, creatorId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los creadores</option>
              {creators.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Selecciona el creador de la auditoría</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button variant="secondary" onClick={handleGenerateReport}>Generar Métricas</Button>
          <Button variant="primary" onClick={() => handleGenerateFiltered(true)}>Generar Informes (completo)</Button>
          <Button variant="secondary" onClick={() => handleGenerateFiltered(false)}>Generar Informes (según filtros)</Button>
          {auditId && <Button variant="ghost" onClick={handleDownloadAuditPdf}>Descargar PDF de auditoría</Button>}
          {loading && <div className="ml-auto"><LoadingSpinner /></div>}
        </div>

        {jobProgress !== null && (
          <div className="mt-3">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Progreso del job: {jobProgress}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded overflow-hidden">
              <div style={{ width: `${jobProgress}%` }} className="h-2 bg-blue-600" />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Auditorías</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metrics.totalAudits ?? '-'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Activas</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{metrics.activeAudits ?? '-'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Cumplimiento Promedio</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{metrics.complianceRate ?? '-'}</p>
        </div>
      </div>

      {reportsList.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informes generados</h2>
          <ul className="space-y-2">
            {reportsList.slice((currentPage-1)*perPage, currentPage*perPage).map(r => (
              <li key={r.auditId} className="flex items-center justify-between">
                <div>Auditoría #{r.auditId}</div>
                <div>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Descargar</a>
                  ) : (
                    <span className="text-red-600">Error: {r.error}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {reportsList.length > perPage && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button className="px-3 py-1 border rounded" disabled={currentPage===1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Anterior</button>
              <span>Pagina {currentPage} de {Math.ceil(reportsList.length / perPage)}</span>
              <button className="px-3 py-1 border rounded" disabled={currentPage===Math.ceil(reportsList.length / perPage)} onClick={() => setCurrentPage(p => Math.min(Math.ceil(reportsList.length / perPage), p+1))}>Siguiente</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;