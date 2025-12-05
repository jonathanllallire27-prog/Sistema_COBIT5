import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cobitService } from '@/services/cobitService';
import { CobitProcess, Control } from '@/types';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CobitProcesses: React.FC = () => {
  const [processes, setProcesses] = useState<CobitProcess[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [processesData, controlsData] = await Promise.all([
        cobitService.getProcesses(),
        cobitService.getAllControls(),
      ]);
      setProcesses(processesData);
      setControls(controlsData);
    } catch (error) {
      console.error('Error fetching COBIT data:', error);
      toast.error('Error al cargar los procesos COBIT');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProcesses = processes.filter((process) => {
    const matchesSearch = process.process_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.process_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === 'all' || process.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  const getProcessControls = (processId: number) => {
    return controls.filter(control => control.process_id === processId);
  };

  const toggleProcess = (processId: number) => {
    setExpandedProcess(expandedProcess === processId ? null : processId);
  };

  const domainNames: Record<string, string> = {
    EDM: 'Evaluate, Direct and Monitor',
    APO: 'Align, Plan and Organize',
    BAI: 'Build, Acquire and Implement',
    DSS: 'Deliver, Service and Support',
    MEA: 'Monitor, Evaluate and Assess',
  };

  const domainColors: Record<string, string> = {
    EDM: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    APO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    BAI: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    DSS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    MEA: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Procesos COBIT 5
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Catálogo completo de los 37 procesos y sus controles
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
          <Info className="h-5 w-5" />
          Guía COBIT
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar procesos o controles..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="all">Todos los dominios</option>
              <option value="EDM">EDM - Evaluate, Direct and Monitor</option>
              <option value="APO">APO - Align, Plan and Organize</option>
              <option value="BAI">BAI - Build, Acquire and Implement</option>
              <option value="DSS">DSS - Deliver, Service and Support</option>
              <option value="MEA">MEA - Monitor, Evaluate and Assess</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(domainNames).map(([domain, name]) => {
          const count = processes.filter(p => p.domain === domain).length;
          return (
            <div
              key={domain}
              className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${domainColors[domain]}`}>
                <span className="font-bold">{domain}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {count}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Procesos
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Processes List */}
      <div className="space-y-4">
        {filteredProcesses.map((process) => {
          const processControls = getProcessControls(process.id);
          const isExpanded = expandedProcess === process.id;

          return (
            <div
              key={process.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              {/* Process Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => toggleProcess(process.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${domainColors[process.domain]}`}>
                        {process.process_code}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {process.process_name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {process.description}
                    </p>
                    {process.process_goals && process.process_goals.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Objetivos del Proceso:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {process.process_goals.slice(0, 2).map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                          {process.process_goals.length > 2 && (
                            <li className="text-gray-500">... y {process.process_goals.length - 2} más</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {processControls.length}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Controles
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Controls (Expanded) */}
              {isExpanded && processControls.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-800 p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Controles Asociados ({processControls.length})
                  </h4>
                  <div className="space-y-4">
                    {processControls.map((control) => (
                      <div
                        key={control.id}
                        className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {control.control_code}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                Peso: {control.weight}
                              </span>
                            </div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {control.control_statement}
                            </p>
                          </div>
                        </div>
                        
                        {control.metrics && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Métricas:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {control.metrics}
                            </p>
                          </div>
                        )}

                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Niveles de Madurez:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(control.maturity_levels || {}).map(([level, description]) => (
                              <div
                                key={level}
                                className="p-3 border border-gray-200 dark:border-gray-800 rounded"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
                                    <span className="text-xs font-bold">{level}</span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Nivel {level}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredProcesses.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron procesos
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Intenta con otros filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CobitProcesses;