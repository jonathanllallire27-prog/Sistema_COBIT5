import React, { useState } from 'react';
import { Assessment } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ControlAssessment from './ControlAssessment';

interface ControlListProps {
  assessments: Assessment[];
  onAssessmentChange?: (assessmentId: number, data: Partial<Assessment>) => Promise<Assessment> | Promise<void>;
}

const ControlList: React.FC<ControlListProps> = ({ assessments, onAssessmentChange }) => {
  const [expandedControl, setExpandedControl] = useState<number | null>(null);

  if (!assessments || assessments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No hay controles para evaluar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assessments.map((assessment) => (
        <div
          key={assessment.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <button
            onClick={() =>
              setExpandedControl(
                expandedControl === assessment.id ? null : assessment.id
              )
            }
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {assessment.Control?.control_code} - {assessment.Control?.control_statement}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Estado: {assessment.status}
              </p>
            </div>
            {expandedControl === assessment.id ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {expandedControl === assessment.id && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
              <ControlAssessment
                assessment={assessment}
                onClose={() => setExpandedControl(null)}
                onUpdate={async (id, data) => {
                  if (onAssessmentChange) {
                    await onAssessmentChange(id, data);
                  }
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlList;
