import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';

interface FiltersSectionProps {
  filters: {
    dateRange: string;
    auditType: string;
    controlObjective: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onGenerateReport: () => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onFilterChange,
  onGenerateReport,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200/80 dark:border-gray-800/80 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          Filtros de Informe
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rango de Fechas */}
        <div className="flex flex-col">
          <label className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
            Rango de Fechas
          </label>
          <div className="relative">
            <Input
              type="text"
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              placeholder="Seleccionar rango"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Tipo de Auditoría */}
        <div className="flex flex-col">
          <label className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
            Tipo de Auditoría
          </label>
          <Select
            value={filters.auditType}
            onChange={(e) => onFilterChange('auditType', e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="internal">Interna</option>
            <option value="external">Externa</option>
            <option value="compliance">Cumplimiento</option>
          </Select>
        </div>

        {/* Objetivo de Control */}
        <div className="flex flex-col">
          <label className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
            Objetivo de Control
          </label>
          <Select
            value={filters.controlObjective}
            onChange={(e) => onFilterChange('controlObjective', e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="APO01">APO01 - Gestionar el marco de gestión</option>
            <option value="APO02">APO02 - Gestionar la estrategia</option>
            <option value="BAI01">BAI01 - Gestionar programas</option>
            <option value="DSS01">DSS01 - Gestionar operaciones</option>
            <option value="MEA01">MEA01 - Monitorear y evaluar</option>
          </Select>
        </div>

        {/* Botón Generar */}
        <div className="flex items-end">
          <Button
            onClick={onGenerateReport}
            variant="primary"
            fullWidth
          >
            Generar Informe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection; 