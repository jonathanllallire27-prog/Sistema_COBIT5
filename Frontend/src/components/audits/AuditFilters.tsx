import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';

interface AuditFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar auditorías..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="planned">Planeadas</option>
            <option value="in_progress">En Progreso</option>
            <option value="review">En Revisión</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </Select>
        </div>

        {/* Additional Filters Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Más Filtros</span>
        </button>
      </div>
    </div>
  );
};

export default AuditFilters;