import api from './api';

export const reportService = {
  async generateAuditReport(auditId: number, format: 'pdf' | 'excel' | 'word') {
    // Backend currently supports PDF at /reports/audit/:auditId/pdf
    if (format !== 'pdf') {
      throw new Error('Formato no soportado en el servidor');
    }
    const response = await api.get(`/reports/audit/${auditId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

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

  async getReportData(auditId: number) {
    const response = await api.get(`/reports/audit/${auditId}/json`);
    return response.data.data;
  },
  async generateAllReports() {
    const response = await api.post('/reports/generate-all');
    return response.data.data;
  }
  ,
  async generateFilteredReports(filters: { dateFrom?: string; dateTo?: string; status?: string; creatorId?: number; all?: boolean }) {
    const response = await api.post('/reports/generate', filters);
    return response.data.data;
  }
  ,
  async submitReportJob(filters: { dateFrom?: string; dateTo?: string; status?: string; creatorId?: number; all?: boolean }) {
    const response = await api.post('/reports/submit', filters);
    return response.data.data;
  },
  async getJobStatus(jobId: number) {
    const response = await api.get(`/reports/jobs/${jobId}`);
    return response.data.data;
  }
};