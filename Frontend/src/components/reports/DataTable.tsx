import React from 'react';
import { Eye, Download, MoreVertical } from 'lucide-react';
import Button from '@/components/common/Button';

interface AuditRow {
  id: string;
  fecha: string;
  tipo: string;
  estado: 'Completada' | 'En Progreso' | 'Planeada';
  score: string;
}

const DataTable: React.FC = () => {
  const audits: AuditRow[] = [
    { id: 'AUD-001', fecha: '2024-10-01', tipo: 'Interna', estado: 'Completada', score: '98%' },
    { id: 'AUD-002', fecha: '2024-09-25', tipo: 'Externa', estado: 'Completada', score: '95%' },
    { id: 'AUD-003', fecha: '2024-09-15', tipo: 'Interna', estado: 'En Progreso', score: 'N/A' },
    { id: 'AUD-004', fecha: '2024-09-10', tipo: 'Interna', estado: 'Completada', score: '88%' },
    { id: 'AUD-005', fecha: '2024-08-28', tipo: 'Cumplimiento', estado: 'Completada', score: '92%' },
    { id: 'AUD-006', fecha: '2024-08-15', tipo: 'Interna', estado: 'Completada', score: '96%' },
  ];

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Completada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Planeada':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Detalle de Auditorías
          </h3>
          <Button variant="outline" size="sm" icon={Download}>
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">Audit ID</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Tipo</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-right">Score</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {audits.map((audit) => (
              <tr
                key={audit.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {audit.id}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {audit.fecha}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {audit.tipo}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(audit.estado)}`}>
                    {audit.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  {audit.score}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={MoreVertical}
                      className="h-8 w-8 p-0"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando 6 de 12 auditorías
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;