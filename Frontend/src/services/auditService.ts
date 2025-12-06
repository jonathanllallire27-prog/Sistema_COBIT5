import api from './api';
import { Audit, Assessment, Finding, DashboardMetrics } from '@/types';

export const auditService = {
  async getAll(): Promise<Audit[]> {
    const response = await api.get('/audits');
    return response.data.data;
  },

  async getById(id: number): Promise<Audit> {
    const response = await api.get(`/audits/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Audit>): Promise<Audit> {
    const response = await api.post('/audits', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<Audit>): Promise<Audit> {
    const response = await api.put(`/audits/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/audits/${id}`);
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/audits/dashboard');
    return response.data.data.metrics;
  },

  async getAssessments(auditId: number): Promise<Assessment[]> {
    const response = await api.get(`/assessments/audit/${auditId}`);
    return response.data.data;
  },

  async updateAssessment(id: number, data: Partial<Assessment>): Promise<Assessment> {
    const response = await api.put(`/assessments/${id}`, data);
    return response.data.data;
  },

  async getFindings(auditId: number): Promise<Finding[]> {
    const response = await api.get(`/findings/audit/${auditId}`);
    return response.data.data;
  },

  async createFinding(auditId: number, data: Partial<Finding>): Promise<Finding> {
    const response = await api.post(`/findings/audit/${auditId}`, data);
    return response.data.data;
  },

  async uploadFindingEvidence(findingId: number, file: File, description?: string) {
    const form = new FormData();
    form.append('file', file);
    if (description) form.append('description', description);

    const response = await api.post(`/findings/${findingId}/evidence`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data;
  },
  async updateFinding(findingId: number, data: Partial<Finding>): Promise<Finding> {
    const response = await api.put(`/findings/${findingId}`, data);
    return response.data.data;
  },
  async deleteFinding(findingId: number): Promise<void> {
    await api.delete(`/findings/${findingId}`);
  },
};