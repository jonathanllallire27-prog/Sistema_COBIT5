import api from './api';
import { CobitProcess, Control } from '@/types';

export const cobitService = {
  async getProcesses(): Promise<CobitProcess[]> {
    const response = await api.get('/cobit/processes');
    return response.data.data.processes;
  },

  async getAllControls(): Promise<Control[]> {
    const response = await api.get('/cobit/controls');
    return response.data.data;
  },

  async getControlsByProcess(processId: number): Promise<Control[]> {
    const response = await api.get(`/cobit/process/${processId}/controls`);
    return response.data.data;
  },

  async getProcessById(processId: number): Promise<CobitProcess> {
    const response = await api.get(`/cobit/processes/${processId}`);
    return response.data.data;
  },
};