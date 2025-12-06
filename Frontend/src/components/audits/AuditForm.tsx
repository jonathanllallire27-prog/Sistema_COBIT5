import React, { useEffect, useState } from 'react';
import { X, Calendar, Users, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Audit } from '@/types';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { cobitService } from '@/services/cobitService';
import { CobitProcess } from '@/types';

const auditSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['planned', 'in_progress', 'review', 'completed', 'cancelled']),
  scope_processes: z.array(z.number()).min(1, 'Seleccione al menos un proceso'),
});

type AuditFormData = z.infer<typeof auditSchema>;

interface AuditFormProps {
  audit?: Audit | null;
  onSubmit: (data: AuditFormData) => void;
  onClose: () => void;
}

const AuditForm: React.FC<AuditFormProps> = ({ audit, onSubmit, onClose }) => {
  const [processes, setProcesses] = useState<CobitProcess[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<number[]>(
    audit?.scope_processes || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      name: audit?.name || '',
      description: audit?.description || '',
      start_date: audit?.start_date?.split('T')[0] || '',
      end_date: audit?.end_date?.split('T')[0] || '',
      status: audit?.status || 'planned',
      scope_processes: audit?.scope_processes || [],
    },
  });

  useEffect(() => {
    fetchProcesses();
  }, []);

  useEffect(() => {
    setValue('scope_processes', selectedProcesses);
  }, [selectedProcesses, setValue]);

  const fetchProcesses = async () => {
    try {
      const data = await cobitService.getProcesses();
      setProcesses(data);
    } catch (error) {
      console.error('Error fetching processes:', error);
    }
  };

  const toggleProcess = (processId: number) => {
    setSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
  };

  const onSubmitForm = (data: AuditFormData) => {
    return onSubmit(data);
  };

  const groupedProcesses = processes.reduce((acc, process) => {
    if (!acc[process.domain]) {
      acc[process.domain] = [];
    }
    acc[process.domain].push(process);
    return acc;
  }, {} as Record<string, CobitProcess[]>);

  const domainNames: Record<string, string> = {
    EDM: 'Evaluate, Direct and Monitor',
    APO: 'Align, Plan and Organize',
    BAI: 'Build, Acquire and Implement',
    DSS: 'Deliver, Service and Support',
    MEA: 'Monitor, Evaluate and Assess',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {audit ? 'Editar Auditoría' : 'Nueva Auditoría'}
              </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de la Auditoría *
              </label>
              <Input
                {...register('name')}
                placeholder="Ej: Auditoría de Seguridad TI Q4 2024"
                error={errors.name?.message}
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado *
              </label>
              <Select {...register('status')} error={errors.status?.message}>
                <option value="planned">Planeada</option>
                <option value="in_progress">En Progreso</option>
                <option value="review">En Revisión</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </Select>
            </div>

            {/* Fecha Inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de Inicio
              </label>
              <Input
                type="date"
                {...register('start_date')}
                error={errors.start_date?.message}
              />
            </div>

            {/* Fecha Fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de Fin
              </label>
              <Input
                type="date"
                {...register('end_date')}
                error={errors.end_date?.message}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors"
              placeholder="Describe el propósito y alcance de la auditoría..."
            />
          </div>

          {/* Procesos COBIT */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Procesos COBIT 5 a Auditar *
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Seleccionados: {selectedProcesses.length}
              </span>
            </div>
            
            {errors.scope_processes && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.scope_processes.message}
              </p>
            )}

            <div className="space-y-4">
              {Object.entries(groupedProcesses).map(([domain, domainProcesses]) => (
                <div key={domain} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {domain} - {domainNames[domain] || domain}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {domainProcesses.map((process) => (
                      <label
                        key={process.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProcesses.includes(process.id)}
                          onChange={() => toggleProcess(process.id)}
                          className="h-4 w-4 text-primary rounded focus:ring-primary border-gray-300 dark:border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {process.process_code}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {process.process_name}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
              >
                {audit ? 'Actualizar' : 'Crear'} Auditoría
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditForm;