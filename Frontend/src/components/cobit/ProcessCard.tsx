import React, { useState } from 'react';
import { CobitProcess } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProcessCardProps {
  process: CobitProcess;
  onSelect?: (process: CobitProcess) => void;
  selected?: boolean;
  expandable?: boolean;
  children?: React.ReactNode;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  process,
  onSelect,
  selected,
  expandable = true,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  const domainColors: Record<string, string> = {
    EDM: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border-blue-200 dark:border-blue-800',
    APO: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 border-purple-200 dark:border-purple-800',
    BAI: 'from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/30 border-cyan-200 dark:border-cyan-800',
    DSS: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800',
    MEA: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 border-orange-200 dark:border-orange-800',
  };

  const domainBadgeColors: Record<string, string> = {
    EDM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    APO: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    BAI: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    DSS: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    MEA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };

  return (
    <div
      className={`rounded-lg border overflow-hidden transition-all ${
        domainColors[process.domain] || 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
      } ${selected ? 'ring-2 ring-primary shadow-lg' : ''}`}
    >
      <div
        className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => expandable && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${domainBadgeColors[process.domain] || 'bg-gray-200 text-gray-800'}`}>
                {process.domain}
              </span>
              <code className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-300">
                {process.process_code}
              </code>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {process.process_name}
            </h3>
            {process.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {process.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onSelect && (
              <input
                type="checkbox"
                checked={selected || false}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(process);
                }}
                className="w-5 h-5 cursor-pointer"
              />
            )}
            {expandable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="p-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded transition-colors"
              >
                {expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {expandable && expanded && children && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-900/50">
          {children}
        </div>
      )}

      {expandable && expanded && !children && process.process_goals && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-900/50">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Objetivos del Proceso:
          </h4>
          <ul className="space-y-2">
            {process.process_goals.map((goal, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProcessCard;
