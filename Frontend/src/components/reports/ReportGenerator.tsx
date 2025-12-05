import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, File, Check } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

interface ReportGeneratorProps {
  onClose: () => void;
  onGenerate: () => void;
  onExport: (format: 'pdf' | 'excel' | 'word') => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  onClose,
  onGenerate,
  onExport,
}) => {
  const [reportName, setReportName] = useState('');
  const [sections, setSections] = useState({
    executiveSummary: true,
    auditDetails: true,
    findings: true,
    recommendations: true,
    annexes: false,
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const exportOptions = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'excel', label: 'Excel Spreadsheet', icon: FileSpreadsheet },
    { value: 'word', label: 'Word Document', icon: File },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Generar Informe Personalizado
            </h2>
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
          {/* Report Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre del Informe
            </label>
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Ej: Informe de Auditoría Q3 2024"
            />
          </div>

          {/* Sections to Include */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Secciones a Incluir
            </label>
            {Object.entries(sections).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleSection(key as keyof typeof sections)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                    value
                      ? 'bg-primary border-primary'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {value && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>

          {/* Export Format */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Formato de Exportación
            </label>
            <div className="grid grid-cols-3 gap-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => onExport(option.value as any)}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Icon className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </button>
                );
              })}
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
              onClick={() => {
                onGenerate();
                onClose();
              }}
            >
              Generar Informe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;