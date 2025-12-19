import api from './api';

export const reportService = {
  // Reporte completo de auditoría
  async generateAuditReport(auditId: number, format: 'pdf' | 'excel' | 'word'): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Resumen ejecutivo
  async generateExecutiveSummary(auditId: number): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/executive-summary`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte de cumplimiento por dominio
  async generateComplianceReport(auditId: number, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/compliance?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte de hallazgos
  async generateFindingsReport(auditId: number, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/findings?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte de evaluación de riesgos
  async generateRiskReport(auditId: number): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/risk-assessment`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte de estado de controles
  async generateControlStatusReport(auditId: number, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/control-status?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte de análisis de tendencias
  async generateTrendReport(auditId: number): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/trends`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte de plan de acción
  async generateActionPlanReport(auditId: number, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await api.get(`/reports/audit/${auditId}/action-plan?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Descargar reporte genérico
  async downloadReport(url: string, filename: string) {
    const response = await api.get(url, {
      responseType: 'blob',
    });

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  // Obtener datos JSON del reporte
  async getReportData(auditId: number) {
    const response = await api.get(`/reports/audit/${auditId}/json`);
    return response.data.data;
  },

  // Generar reportes para todas las auditorías
  async generateAllReports() {
    const response = await api.post('/reports/generate-all');
    return response.data.data;
  },

  // Generar reportes con filtros
  async generateFilteredReports(filters: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    creatorId?: number;
    all?: boolean
  }) {
    const response = await api.post('/reports/generate', filters);
    return response.data.data;
  },

  // Enviar trabajo de generación en background
  async submitReportJob(filters: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    creatorId?: number;
    all?: boolean
  }) {
    const response = await api.post('/reports/submit', filters);
    return response.data.data;
  },

  // Obtener estado de un trabajo
  async getJobStatus(jobId: number) {
    const response = await api.get(`/reports/jobs/${jobId}`);
    return response.data.data;
  },

  // Obtener lista de reportes disponibles para una auditoría
  async getAvailableReports(auditId: number) {
    const response = await api.get(`/reports/audit/${auditId}/available`);
    return response.data.data;
  }
};