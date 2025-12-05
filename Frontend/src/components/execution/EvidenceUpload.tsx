import React, { useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

interface Evidence {
  id?: number;
  filename: string;
  filepath?: string;
  filesize?: number;
  description?: string;
}

interface EvidenceUploadProps {
  evidences?: Evidence[];
  onEvidencesChange?: (evidences: Evidence[]) => void;
  assessmentId?: number;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ 
  evidences = [], 
  onEvidencesChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Archivo ${file.name} es muy grande (máx. 10MB)`);
        continue;
      }

      const newEvidence: Evidence = {
        filename: file.name,
        filesize: file.size,
        filepath: URL.createObjectURL(file),
        description: '',
      };

      const updated = [...evidences, newEvidence];
      onEvidencesChange?.(updated);
      toast.success(`Archivo ${file.name} agregado`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updated = evidences.filter((_, i) => i !== index);
    onEvidencesChange?.(updated);
    toast.success('Archivo removido');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
          Evidencia de Control
        </label>
        
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Arrastra archivos aquí o
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Seleccionar archivo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.txt"
          />
        </div>
      </div>

      {evidences.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Archivos cargados ({evidences.length})
          </h4>
          <div className="space-y-2">
            {evidences.map((evidence, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {evidence.filename}
                    </p>
                    {evidence.filesize && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(evidence.filesize / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  icon={X}
                  className="text-red-600 hover:text-red-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
