import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings as SettingsIcon, Moon, Sun, Bell, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const settingsSchema = z.object({
  organization_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  organization_email: z.string().email('Email inválido'),
  theme: z.enum(['light', 'dark', 'auto']),
  notifications_email: z.boolean(),
  notifications_system: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      organization_name: 'AuditSys',
      organization_email: 'admin@auditsys.com',
      theme: 'auto',
      notifications_email: true,
      notifications_system: true,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/settings');
        const settings = response.data.data;
        reset(settings);
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await api.put('/settings', data);
      toast.success('Configuración actualizada correctamente');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al guardar configuración');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestione la configuración general del sistema
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Configuración General */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Configuración General
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de la Organización
              </label>
              <Input
                {...register('organization_name')}
                placeholder="Ej: AuditSys"
                error={errors.organization_name?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email de la Organización
              </label>
              <Input
                type="email"
                {...register('organization_email')}
                placeholder="admin@auditsys.com"
                error={errors.organization_email?.message}
              />
            </div>
          </div>
        </div>

        {/* Configuración de Apariencia */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Apariencia
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tema
              </label>
              <select
                {...register('theme')}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
              {errors.theme && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.theme.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Modo {isDarkMode ? 'Oscuro' : 'Claro'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cambiar modo de visualización
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Configuración de Notificaciones */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Notificaciones
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Notificaciones por Email
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recibir alertas y actualizaciones por correo electrónico
                </p>
              </div>
              <input
                type="checkbox"
                {...register('notifications_email')}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Notificaciones del Sistema
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recibir alertas dentro de la aplicación
                </p>
              </div>
              <input
                type="checkbox"
                {...register('notifications_system')}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Información de Seguridad */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                Información de Seguridad
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                Se recomienda cambiar su contraseña regularmente. Si ha olvidado su contraseña,
                contacte al administrador del sistema.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
