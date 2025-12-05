import React, { useState } from 'react';

const Reports: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '2024-09-05:2024-10-07',
    auditType: 'all',
    controlObjective: 'all',
    search: '',
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleGenerateReport = () => {
    console.log('Generando reporte con filtros:', filters);
    // Aquí iría la lógica para generar el reporte
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Informes y Analíticas</h1>
        <p className="text-gray-600 dark:text-gray-400">Genere informes personalizados sobre el rendimiento y cumplimiento de las auditorías.</p>
      </div>

      <div className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Buscar reporte..."
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          value={filters.search}
          onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
        />
        <button
          onClick={handleGenerateReport}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Generar Reporte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Auditorías</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">24</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completadas</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">18</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Cumplimiento Promedio</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">75%</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;