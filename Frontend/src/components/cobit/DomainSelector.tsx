import React from 'react';
import { Shield, TrendingUp, Zap, Activity, CheckSquare } from 'lucide-react';

interface DomainSelectorProps {
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
}

const COBIT5_DOMAINS = [
  {
    code: 'EDM',
    name: 'Evaluate, Direct and Monitor',
    description: 'Evaluar, Dirigir y Monitorear',
    color: 'from-blue-500 to-blue-600',
    icon: Shield,
  },
  {
    code: 'APO',
    name: 'Align, Plan and Organise',
    description: 'Alinear, Planificar y Organizar',
    color: 'from-purple-500 to-purple-600',
    icon: TrendingUp,
  },
  {
    code: 'BAI',
    name: 'Build, Acquire and Implement',
    description: 'Construir, Adquirir e Implementar',
    color: 'from-cyan-500 to-cyan-600',
    icon: Zap,
  },
  {
    code: 'DSS',
    name: 'Deliver, Service and Support',
    description: 'Entregar, Servir y Soportar',
    color: 'from-emerald-500 to-emerald-600',
    icon: Activity,
  },
  {
    code: 'MEA',
    name: 'Monitor, Evaluate and Assess',
    description: 'Monitorear, Evaluar y Valorar',
    color: 'from-orange-500 to-orange-600',
    icon: CheckSquare,
  },
];

const DomainSelector: React.FC<DomainSelectorProps> = ({ selectedDomain, onDomainChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {COBIT5_DOMAINS.map((domain) => {
        const IconComponent = domain.icon;
        const isSelected = selectedDomain === domain.code;
        
        return (
          <button
            key={domain.code}
            onClick={() => onDomainChange(domain.code)}
            className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
              isSelected
                ? `bg-gradient-to-br ${domain.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 ring-gray-300 dark:ring-gray-700`
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <IconComponent className="h-6 w-6" />
              <div className="text-left">
                <div className="font-bold text-lg">{domain.code}</div>
                <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                  {domain.description}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DomainSelector;
