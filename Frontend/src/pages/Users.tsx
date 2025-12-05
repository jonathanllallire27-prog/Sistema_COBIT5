import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Shield, Mail, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { User } from '@/types';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const userSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'auditor', 'audit_leader', 'process_owner', 'reviewer']),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: editingUser?.name || '',
      email: editingUser?.email || '',
      role: editingUser?.role || 'auditor',
      password: '',
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        await api.post('/users', data);
        toast.success('Usuario creado correctamente');
      }
      reset();
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('¿Está seguro que desea eliminar este usuario?')) return;
    
    try {
      await api.delete(`/users/${userId}`);
      toast.success('Usuario eliminado correctamente');
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    reset();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    auditor: 'Auditor',
    audit_leader: 'Líder de Auditoría',
    process_owner: 'Propietario de Proceso',
    reviewer: 'Revisor',
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    auditor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    audit_leader: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    process_owner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    reviewer: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Administre usuarios y sus permisos de acceso
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            reset();
            setShowForm(true);
          }}
          icon={Plus}
          variant="primary"
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <Input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        icon={Edit}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        icon={Trash2}
                        className="text-red-600 hover:text-red-700"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay usuarios que mostrar
            </p>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre Completo *
                </label>
                <Input
                  {...register('name')}
                  placeholder="Ej: Juan Pérez"
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="correo@ejemplo.com"
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol *
                </label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="auditor">Auditor</option>
                  <option value="audit_leader">Líder de Auditoría</option>
                  <option value="process_owner">Propietario de Proceso</option>
                  <option value="reviewer">Revisor</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña {!editingUser && '*'}
                </label>
                <Input
                  type="password"
                  {...register('password')}
                  placeholder={editingUser ? 'Dejar en blanco para no cambiar' : 'Contraseña segura'}
                  error={errors.password?.message}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
