import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Assessment } from '@/types';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import EvidenceUpload from './EvidenceUpload';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ControlAssessmentProps {
  assessment: Assessment;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<Assessment>) => Promise<void>;
}

const ControlAssessment: React.FC<ControlAssessmentProps> = ({
  assessment,
  onClose,
  onUpdate,
}) => {
  const [compliance, setCompliance] = useState(assessment.compliance || '');
  const [score, setScore] = useState(assessment.score?.toString() || '');
  const [notes, setNotes] = useState(assessment.notes || '');
  const [evidenceSummary, setEvidenceSummary] = useState(assessment.evidence_summary || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false);
  const [evidences, setEvidences] = useState<any[]>([]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onUpdate(assessment.id, {
        compliance: compliance as any,
        score: score ? parseInt(score) : undefined,
        notes,
        evidence_summary: evidenceSummary,
        status: 'completed',
      });
      onClose();
    } catch (error) {
      console.error('Error updating assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get compliance options
  const getComplianceOptions = () => [
    { value: '', label: 'Seleccionar estado', icon: null },
    { value: 'compliant', label: 'Cumple', icon: CheckCircle, color: 'text-green-500' },
    { value: 'partially_compliant', label: 'Cumple Parcialmente', icon: AlertCircle, color: 'text-yellow-500' },
    { value: 'non_compliant', label: 'No Cumple', icon: XCircle, color: 'text-red-500' },
    { value: 'not_applicable', label: 'No Aplica', icon: FileText, color: 'text-gray-500' },
  ];

  // Get the currently selected compliance option (for reference)
  void getComplianceOptions().find(opt => opt.value === compliance);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Evaluar Control
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {assessment.Control?.control_code} - {assessment.Control?.control_statement}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Control Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Información del Control
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600 dark:text-gray-400">Código:</span> {assessment.Control?.control_code}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Dominio:</span> {assessment.Control?.CobitProcess?.domain}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Proceso:</span> {assessment.Control?.CobitProcess?.process_name}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Métricas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {assessment.Control?.metrics || 'No se definieron métricas específicas'}
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Form */}
          <div className="space-y-6">
            {/* Compliance Status */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado de Cumplimiento *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getComplianceOptions().filter(opt => opt.value).map((option) => {
                  const Icon = option.icon!;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCompliance(option.value)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                        compliance === option.value
                          ? 'border-primary bg-primary-50 dark:bg-primary-900/30'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${option.color}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Puntuación (0-5)
                </label>
                <Select
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                >
                  <option value="">No puntuar</option>
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} - {num === 0 ? 'No existe' : 
                             num === 1 ? 'Inicial' :
                             num === 2 ? 'Repetible' :
                             num === 3 ? 'Definido' :
                             num === 4 ? 'Gestionado' : 'Optimizado'}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Evidence Summary */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resumen de Evidencia
                </label>
                <Input
                  value={evidenceSummary}
                  onChange={(e) => setEvidenceSummary(e.target.value)}
                  placeholder="Breve descripción de la evidencia recolectada"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Notas y Observaciones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors"
                placeholder="Describe tus observaciones, hallazgos y cualquier información relevante..."
              />
            </div>

            {/* Evidence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Evidencia Adjunta
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Upload}
                  onClick={() => setShowEvidenceUpload(true)}
                >
                  Agregar Evidencia
                </Button>
              </div>
              
              {assessment.Evidences && assessment.Evidences.length > 0 ? (
                <div className="space-y-2">
                  {assessment.Evidences.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {evidence.filename}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(evidence.uploaded_at), 'PPpp', { locale: es })}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                        {evidence.classification}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay evidencia adjunta
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Agrega evidencia para respaldar tu evaluación
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!compliance}
            >
              Guardar Evaluación
            </Button>
          </div>
        </div>
      </div>

      {/* Evidence Upload Modal */}
      {showEvidenceUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Cargar Evidencia</h2>
              <button
                onClick={() => setShowEvidenceUpload(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <EvidenceUpload
                assessmentId={assessment.id}
                evidences={evidences}
                onEvidencesChange={(updatedEvidences) => {
                  setEvidences(updatedEvidences);
                  setShowEvidenceUpload(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlAssessment;