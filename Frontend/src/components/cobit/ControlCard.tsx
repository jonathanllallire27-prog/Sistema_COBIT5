import React, { useState } from 'react';
import { Control, CobitProcess } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ControlCardProps {
  control: Control & { CobitProcess?: CobitProcess };
  selected?: boolean;
  onSelect?: (control: Control) => void;
}

const ControlCard: React.FC<ControlCardProps> = ({ control, selected, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const getMaturityColor = (level: number) => {
    const colors = {
      0: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      1: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      3: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      4: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      5: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  const getMaturityLabel = (level: number) => {
    const labels = {
      0: 'No Optimizado',
      1: 'Repetible',
      2: 'Definido',
      3: 'Administrado',
      4: 'Optimizado',
      5: 'Optimizado Continuo',
    };
    return labels[level as keyof typeof labels] || 'Desconocido';
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        selected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <code className="text-sm font-bold text-primary">
              {control.control_code}
            </code>
            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
              Peso: {control.weight}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
            {control.control_statement}
          </h4>
          {control.CobitProcess && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {control.CobitProcess.process_code} - {control.CobitProcess.process_name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onSelect && (
            <input
              type="checkbox"
              checked={selected || false}
              onChange={() => onSelect(control)}
              className="w-4 h-4 cursor-pointer"
            />
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
          {control.metrics && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Métricas:
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {control.metrics}
              </p>
            </div>
          )}

          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niveles de Madurez:
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(control.maturity_levels || {})
                .slice(0, 6)
                .map(([level]) => (
                  <div
                    key={level}
                    className={`p-2 rounded text-center ${getMaturityColor(
                      parseInt(level)
                    )}`}
                  >
                    <div className="text-xs font-bold">{level}</div>
                    <div className="text-xs mt-1 line-clamp-2">
                      {getMaturityLabel(parseInt(level))}
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {Object.entries(control.maturity_levels || {}).map(([level, description]) => (
                <div key={level}>
                  <span className="font-medium">{level}:</span> {description as string}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlCard;
