import { useState, useEffect } from 'react';
import { auditService } from '@/services/auditService';
import { Audit, Assessment, Finding } from '@/types';
import toast from 'react-hot-toast';

export const useAudit = (auditId?: number) => {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditService.getById(id);
      setAudit(data);
    } catch (err) {
      setError('Error al cargar la auditoría');
      toast.error('Error al cargar la auditoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async (id: number) => {
    try {
      const data = await auditService.getAssessments(id);
      setAssessments(data);
    } catch (err) {
      console.error('Error al cargar evaluaciones:', err);
    }
  };

  const fetchFindings = async (id: number) => {
    try {
      const data = await auditService.getFindings(id);
      setFindings(data);
    } catch (err) {
      console.error('Error al cargar hallazgos:', err);
    }
  };

  const updateAssessment = async (assessmentId: number, data: Partial<Assessment>) => {
    try {
      const updated = await auditService.updateAssessment(assessmentId, data);
      setAssessments((prev) =>
        prev.map((a) => (a.id === assessmentId ? updated : a))
      );
      toast.success('Evaluación actualizada');
      return updated;
    } catch (err) {
      toast.error('Error al actualizar evaluación');
      throw err;
    }
  };

  const createFinding = async (data: Partial<Finding>) => {
    if (!auditId) throw new Error('Audit ID is required');
    
    try {
      const newFinding = await auditService.createFinding(auditId, data);
      setFindings((prev) => [newFinding, ...prev]);
      toast.success('Hallazgo creado exitosamente');
      return newFinding;
    } catch (err) {
      toast.error('Error al crear hallazgo');
      throw err;
    }
  };

  useEffect(() => {
    if (auditId) {
      fetchAudit(auditId);
      fetchAssessments(auditId);
      fetchFindings(auditId);
    }
  }, [auditId]);

  return {
    audit,
    assessments,
    findings,
    loading,
    error,
    fetchAudit,
    updateAssessment,
    createFinding,
    refetch: () => {
      if (auditId) {
        fetchAudit(auditId);
        fetchAssessments(auditId);
        fetchFindings(auditId);
      }
    },
  };
};  