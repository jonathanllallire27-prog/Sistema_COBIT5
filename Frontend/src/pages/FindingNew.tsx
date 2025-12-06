import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAudit } from '@/hooks/useAudit';
import { auditService } from '@/services/auditService';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FindingNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const auditId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();
  const { audit, loading, createFinding } = useAudit(auditId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low'|'medium'|'high'|'critical'>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  if (loading) return <LoadingSpinner />;

  if (!audit) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Auditoría no encontrada.</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditId) return;
    setSubmitting(true);
    try {
      const newFinding = await createFinding({ title, description, severity });

      // Si se seleccionó un archivo, subirlo al endpoint de finding
      if (file && newFinding && newFinding.id) {
        try {
          await auditService.uploadFindingEvidence(newFinding.id, file, 'Documento adjunto');
        } catch (err) {
          console.error('Error subiendo evidencia del hallazgo:', err);
        }
      }

      navigate(`/audits/${auditId}/findings`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Nuevo Hallazgo - Auditoría de sistemas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Auditoría: {audit.name}</p>
      <form onSubmit={onSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 gap-4">
          <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción (opcional)</label>
            <textarea
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 p-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Severidad</label>
            <div className="mt-2 flex gap-2">
              <select
                className="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adjuntar documento (opcional)</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  setFilePreview(f ? f.name : null);
                }}
              />
              {filePreview && (
                <div className="text-sm text-gray-600 dark:text-gray-400">{filePreview}</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear Hallazgo'}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default FindingNew;
