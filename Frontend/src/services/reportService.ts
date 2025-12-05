import api from './api';

export const reportService = {
  async generateAuditReport(auditId: number, format: 'pdf' | 'excel' | 'word') {
    const response = await api.get(`/reports/audit/${auditId}/${format}`, {
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
};