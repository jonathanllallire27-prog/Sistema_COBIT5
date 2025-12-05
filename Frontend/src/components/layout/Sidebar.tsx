import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  CheckCircle, 
  Settings, 
  LogOut,
  Shield,
  Users
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/audits', icon: FolderOpen, label: 'Auditorías' },
    { path: '/cobit', icon: Shield, label: 'Procesos COBIT' },
    { path: '/execution', icon: CheckCircle, label: 'Ejecución' },
    { path: '/reports', icon: BarChart3, label: 'Informes' },
    { path: '/users', icon: Users, label: 'Usuarios', roles: ['admin'] },
    { path: '/settings', icon: Settings, label: 'Configuración' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-screen flex-col border-r border-gray-200/60 bg-white dark:border-gray-800/60 dark:bg-gray-900/50 w-64 p-4 sticky top-0">
      {/* Logo y Nombre */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-lg size-10">
          <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-gray-900 dark:text-white text-base font-bold leading-normal">
            AuditSys
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
            COBIT 5 Auditor
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          // Verificar si el usuario tiene permiso para ver esta ruta
          if (item.roles && user && !item.roles.includes(user.role)) {
            return null;
          }
          
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium leading-normal">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Información del usuario y logout */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full size-8">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role?.replace('_', ' ') || 'auditor'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full mt-2"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium leading-normal">
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;