import React from 'react';
import { Calendar, User, Eye, Edit, Trash2 } from 'lucide-react';
import { Audit } from '@/types';
import Button from '@/components/common/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AuditCardProps {
  audit: Audit;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AuditCard: React.FC<AuditCardProps> = ({
  audit,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      planned: 'Planeada',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return statusMap[status] || status;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onView()}
      onKeyDown={(e) => { if (e.key === 'Enter') onView(); }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {audit.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {audit.description || 'Sin descripción'}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
            {getStatusText(audit.status)}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {audit.start_date ? format(new Date(audit.start_date), 'dd/MM/yyyy', { locale: es }) : 'Sin fecha'}
            </span>
          </div>
          {audit.creator && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="truncate">{audit.creator.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {audit.scope_processes?.length || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Procesos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Hallazgos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              -
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Score
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={(e: any) => { e.stopPropagation(); onView(); }}
            className="h-9 w-9 p-0"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={Edit}
              onClick={(e: any) => { e.stopPropagation(); onEdit(); }}
              className="h-9 w-9 p-0"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={(e: any) => { e.stopPropagation(); onDelete(); }}
              className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCard;