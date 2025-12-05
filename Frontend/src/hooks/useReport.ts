import { useState } from 'react';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';

interface ReportData {
  audit_name: string;
  audit_id: number;
  total_controls: number;
  compliant: number;
  partially_compliant: number;
  non_compliant: number;
  compliance_score: number;
  findings: any[];
  assessments: any[];
  generated_at: string;
}

export const useReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const generateReport = async (auditId: number, format: 'pdf' | 'excel' | 'word' = 'pdf') => {
    try {
      setLoading(true);
      const blob = await reportService.generateAuditReport(auditId, format);
      const filename = `reporte_auditoria_${auditId}_${new Date().getTime()}.${format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'docx'}`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Reporte generado correctamente`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async (auditId: number) => {
    try {
      setLoading(true);
      const data = await reportService.getReportData(auditId);
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Error al cargar datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reportData,
    generateReport,
    fetchReportData,
  };
};
