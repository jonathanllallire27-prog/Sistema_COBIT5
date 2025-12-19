import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  FileType,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Eye,
  Building,
  Users,
  Shield,
  Target,
  Activity
} from 'lucide-react';
import { reportService } from '@/services/reportService';
import { auditService } from '@/services/auditService';
import api from '@/services/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

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
  assessmentsByDomain?: Record<string, any>;
};

type Audit = {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  creator?: { name: string };
};

type ReportType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'audit' | 'compliance' | 'risk' | 'executive';
  formats: ('pdf' | 'excel' | 'word')[];
};

const reportTypes: ReportType[] = [
  {
    id: 'audit_complete',
    name: 'Informe Completo de Auditoría',
    description: 'Reporte detallado con todos los controles, evaluaciones y hallazgos de una auditoría específica.',
    icon: <FileText className="h-6 w-6" />,
    category: 'audit',
    formats: ['pdf', 'excel']
  },
  {
    id: 'executive_summary',
    name: 'Resumen Ejecutivo',
    description: 'Vista general de alto nivel con métricas clave, tendencias y recomendaciones principales.',
    icon: <BarChart3 className="h-6 w-6" />,
    category: 'executive',
    formats: ['pdf']
  },
  {
    id: 'compliance_by_domain',
    name: 'Cumplimiento por Dominio COBIT',
    description: 'Análisis de cumplimiento agrupado por los 5 dominios de COBIT 5 (EDM, APO, BAI, DSS, MEA).',
    icon: <PieChart className="h-6 w-6" />,
    category: 'compliance',
    formats: ['pdf', 'excel']
  },
  {
    id: 'findings_report',
    name: 'Reporte de Hallazgos',
    description: 'Lista detallada de todos los hallazgos con severidad, estado y planes de acción.',
    icon: <AlertTriangle className="h-6 w-6" />,
    category: 'risk',
    formats: ['pdf', 'excel']
  },
  {
    id: 'risk_assessment',
    name: 'Evaluación de Riesgos',
    description: 'Matriz de riesgos basada en hallazgos con análisis de impacto y probabilidad.',
    icon: <Target className="h-6 w-6" />,
    category: 'risk',
    formats: ['pdf']
  },
  {
    id: 'control_status',
    name: 'Estado de Controles',
    description: 'Informe del estado de todos los controles evaluados con nivel de madurez.',
    icon: <Shield className="h-6 w-6" />,
    category: 'compliance',
    formats: ['pdf', 'excel']
  },
  {
    id: 'trend_analysis',
    name: 'Análisis de Tendencias',
    description: 'Comparativa histórica de cumplimiento y evolución de auditorías anteriores.',
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'executive',
    formats: ['pdf']
  },
  {
    id: 'action_plan',
    name: 'Plan de Acción',
    description: 'Reporte de seguimiento de acciones correctivas con responsables y fechas límite.',
    icon: <CheckCircle className="h-6 w-6" />,
    category: 'risk',
    formats: ['pdf', 'excel']
  }
];

const categoryLabels: Record<string, string> = {
  audit: 'Auditoría',
  compliance: 'Cumplimiento',
  risk: 'Riesgos',
  executive: 'Ejecutivo'
};

const categoryColors: Record<string, string> = {
  audit: 'bg-blue-500',
  compliance: 'bg-green-500',
  risk: 'bg-red-500',
  executive: 'bg-purple-500'
};

const Reports: React.FC = () => {
  const { auditId } = useParams<{ auditId?: string }>();

  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'templates'>('generate');
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  const [selectedAudit, setSelectedAudit] = useState<string>(auditId || '');
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>('audit');

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    creatorId: 'all',
  });

  const [creators, setCreators] = useState<Array<{ id: number; name: string }>>([]);
  const [generatedReports, setGeneratedReports] = useState<Array<{
    id: string;
    name: string;
    auditName: string;
    type: string;
    format: string;
    generatedAt: string;
    url?: string;
  }>>([]);

  // Cargar auditorías y creadores
  useEffect(() => {
    const loadData = async () => {
      try {
        const [auditsRes, usersRes, metricsRes] = await Promise.all([
          api.get('/audits'),
          api.get('/users'),
          auditService.getDashboardMetrics()
        ]);
        setAudits(auditsRes.data?.data || []);
        setCreators((usersRes.data?.data || []).map((u: any) => ({ id: u.id, name: u.name })));
        setMetrics(metricsRes as any);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    loadData();
  }, []);

  // Si hay auditId en la URL, seleccionarlo
  useEffect(() => {
    if (auditId) {
      setSelectedAudit(auditId);
    }
  }, [auditId]);

  const handleDownloadReport = async (reportTypeId: string, format: 'pdf' | 'excel') => {
    if (!selectedAudit) {
      toast.error('Por favor selecciona una auditoría');
      return;
    }

    setDownloadingId(reportTypeId);

    try {
      const reportType = reportTypes.find(r => r.id === reportTypeId);

      // Llamar al endpoint correspondiente según el tipo de reporte
      let blob: Blob;
      let filename: string;

      switch (reportTypeId) {
        case 'audit_complete':
          blob = await reportService.generateAuditReport(parseInt(selectedAudit), 'pdf');
          filename = `informe-auditoria-${selectedAudit}.pdf`;
          break;
        case 'executive_summary':
          blob = await reportService.generateExecutiveSummary(parseInt(selectedAudit));
          filename = `resumen-ejecutivo-${selectedAudit}.pdf`;
          break;
        case 'compliance_by_domain':
          blob = await reportService.generateComplianceReport(parseInt(selectedAudit), format);
          filename = `cumplimiento-dominio-${selectedAudit}.${format}`;
          break;
        case 'findings_report':
          blob = await reportService.generateFindingsReport(parseInt(selectedAudit), format);
          filename = `hallazgos-${selectedAudit}.${format}`;
          break;
        case 'risk_assessment':
          blob = await reportService.generateRiskReport(parseInt(selectedAudit));
          filename = `evaluacion-riesgos-${selectedAudit}.pdf`;
          break;
        case 'control_status':
          blob = await reportService.generateControlStatusReport(parseInt(selectedAudit), format);
          filename = `estado-controles-${selectedAudit}.${format}`;
          break;
        case 'trend_analysis':
          blob = await reportService.generateTrendReport(parseInt(selectedAudit));
          filename = `tendencias-${selectedAudit}.pdf`;
          break;
        case 'action_plan':
          blob = await reportService.generateActionPlanReport(parseInt(selectedAudit), format);
          filename = `plan-accion-${selectedAudit}.${format}`;
          break;
        default:
          blob = await reportService.generateAuditReport(parseInt(selectedAudit), 'pdf');
          filename = `reporte-${selectedAudit}.pdf`;
      }

      // Descargar el archivo con el tipo MIME correcto
      const mimeType = format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
      const fileBlob = new Blob([blob], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(fileBlob);

      // Crear link de descarga
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename; // Usar 'download' directamente
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

      // Agregar a reportes generados
      const auditName = audits.find(a => a.id === parseInt(selectedAudit))?.name || `Auditoría #${selectedAudit}`;
      setGeneratedReports(prev => [{
        id: Date.now().toString(),
        name: reportType?.name || 'Reporte',
        auditName,
        type: reportTypeId,
        format,
        generatedAt: new Date().toISOString(),
        url: downloadUrl
      }, ...prev].slice(0, 20));

      toast.success('¡Reporte descargado exitosamente!');
    } catch (err: any) {
      console.error('Error descargando reporte:', err);
      toast.error(err?.response?.data?.message || 'Error al generar el reporte');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleQuickDownload = async (auditId: number) => {
    setLoading(true);
    try {
      const blob = await reportService.generateAuditReport(auditId, 'pdf');
      const filename = `informe-auditoria-${auditId}.pdf`;

      // Crear blob con tipo MIME correcto
      const fileBlob = new Blob([blob], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(fileBlob);

      // Crear link de descarga
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Limpiar después de un momento
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

      toast.success('¡Reporte descargado!');
    } catch (err) {
      toast.error('Error al descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const groupedReportTypes = reportTypes.reduce((acc, report) => {
    if (!acc[report.category]) acc[report.category] = [];
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, ReportType[]>);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      planned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    const labels: Record<string, string> = {
      planned: 'Planeada',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.planned}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            Centro de Informes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Genera y descarga informes detallados sobre las auditorías COBIT 5
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={() => window.location.reload()}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalAudits || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Auditorías</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.activeAudits || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Activas</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {typeof metrics.complianceRate === 'number'
                  ? `${metrics.complianceRate.toFixed(1)}%`
                  : metrics.complianceRate || '0%'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cumplimiento</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.openFindings || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hallazgos Abiertos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          {[
            { id: 'generate', label: 'Generar Informes', icon: FileText },
            { id: 'history', label: 'Auditorías Disponibles', icon: Clock },
            { id: 'templates', label: 'Plantillas Rápidas', icon: FileType }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido por Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Selección */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selector de Auditoría */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Seleccionar Auditoría
              </h3>
              <select
                value={selectedAudit}
                onChange={(e) => setSelectedAudit(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Selecciona una auditoría --</option>
                {audits.map(audit => (
                  <option key={audit.id} value={audit.id}>
                    {audit.name} - {new Date(audit.start_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipos de Reporte */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Tipos de Informe
              </h3>

              <div className="space-y-4">
                {Object.entries(groupedReportTypes).map(([category, reports]) => (
                  <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${categoryColors[category]}`}></span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {categoryLabels[category]}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({reports.length} informes)
                        </span>
                      </div>
                      {expandedCategory === category ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    {expandedCategory === category && (
                      <div className="p-4 space-y-3">
                        {reports.map(report => (
                          <div
                            key={report.id}
                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedReportType === report.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 dark:border-gray-600 hover:border-primary/50'
                              }`}
                            onClick={() => setSelectedReportType(report.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${selectedReportType === report.id
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                  }`}>
                                  {report.icon}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {report.name}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {report.formats.map(fmt => (
                                      <span
                                        key={fmt}
                                        className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded uppercase"
                                      >
                                        {fmt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {selectedReportType === report.id && (
                                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de Descarga */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Descargar Informe
              </h3>

              {selectedReportType && selectedAudit ? (
                <>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Informe seleccionado:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {reportTypes.find(r => r.id === selectedReportType)?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Auditoría:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {audits.find(a => a.id === parseInt(selectedAudit))?.name}
                    </p>
                  </div>

                  {/* Formato */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Formato de descarga
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['pdf', 'excel'] as const).map(fmt => {
                        const report = reportTypes.find(r => r.id === selectedReportType);
                        const isAvailable = report?.formats.includes(fmt);
                        return (
                          <button
                            key={fmt}
                            onClick={() => isAvailable && setSelectedFormat(fmt)}
                            disabled={!isAvailable}
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${!isAvailable
                              ? 'border-gray-200 dark:border-gray-700 opacity-40 cursor-not-allowed'
                              : selectedFormat === fmt
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200 dark:border-gray-600 hover:border-primary/50'
                              }`}
                          >
                            {fmt === 'pdf' && <FileText className="h-5 w-5" />}
                            {fmt === 'excel' && <FileSpreadsheet className="h-5 w-5" />}
                            <span className="text-xs font-medium uppercase">{fmt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    icon={Download}
                    loading={downloadingId === selectedReportType}
                    onClick={() => handleDownloadReport(selectedReportType, selectedFormat)}
                    className="h-12"
                  >
                    Descargar {selectedFormat.toUpperCase()}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Selecciona una auditoría y un tipo de informe para descargar
                  </p>
                </div>
              )}
            </div>

            {/* Reportes Recientes */}
            {generatedReports.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recién Generados
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {generatedReports.slice(0, 5).map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {report.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{report.auditName}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded uppercase">
                        {report.format}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {/* Filtros */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha desde
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha hasta
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                >
                  <option value="all">Todos</option>
                  <option value="planned">Planeada</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Creador
                </label>
                <select
                  value={filters.creatorId}
                  onChange={(e) => setFilters({ ...filters, creatorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                >
                  <option value="all">Todos</option>
                  {creators.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de Auditorías */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Auditoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {audits
                  .filter(a => {
                    if (filters.status !== 'all' && a.status !== filters.status) return false;
                    if (filters.dateFrom && new Date(a.start_date) < new Date(filters.dateFrom)) return false;
                    if (filters.dateTo && new Date(a.start_date) > new Date(filters.dateTo)) return false;
                    return true;
                  })
                  .map(audit => (
                    <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{audit.name}</p>
                          <p className="text-sm text-gray-500">ID: {audit.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(audit.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white">
                            {new Date(audit.start_date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            - {new Date(audit.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Download}
                            onClick={() => handleQuickDownload(audit.id)}
                          >
                            PDF
                          </Button>
                          <Link to={`/audits/${audit.id}`}>
                            <Button variant="ghost" size="sm" icon={Eye}>
                              Ver
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {audits.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No hay auditorías disponibles</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Informe Semanal',
              description: 'Resumen de actividades de auditoría de la última semana',
              icon: Calendar,
              color: 'blue'
            },
            {
              title: 'Informe Mensual',
              description: 'Consolidado de todas las auditorías del mes',
              icon: BarChart3,
              color: 'green'
            },
            {
              title: 'Informe de Riesgos Críticos',
              description: 'Hallazgos de severidad alta y crítica',
              icon: AlertTriangle,
              color: 'red'
            },
            {
              title: 'Informe de Cumplimiento',
              description: 'Estado de cumplimiento por todos los dominios',
              icon: CheckCircle,
              color: 'purple'
            },
            {
              title: 'Informe para Directivos',
              description: 'Resumen ejecutivo para presentación',
              icon: Users,
              color: 'indigo'
            },
            {
              title: 'Informe de Seguimiento',
              description: 'Estado de acciones correctivas pendientes',
              icon: TrendingUp,
              color: 'orange'
            }
          ].map((template, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => {
                setActiveTab('generate');
                toast('Selecciona una auditoría para generar este informe', { icon: '📄' });
              }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-${template.color}-100 dark:bg-${template.color}-900/30 mb-4 group-hover:scale-110 transition-transform`}>
                <template.icon className={`h-6 w-6 text-${template.color}-600 dark:text-${template.color}-400`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {template.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <Button variant="outline" size="sm" icon={Download} fullWidth>
                Generar
              </Button>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-300">Generando informe...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;