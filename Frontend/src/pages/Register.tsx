import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'auditor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('El correo electrónico es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Ingresa un correo electrónico válido');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      });
      
      if (response.success) {
        setIsSuccess(true);
        toast.success('¡Cuenta creada exitosamente!');
      } else {
        toast.error(response.message || 'Error al crear la cuenta');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light to-gray-100 dark:from-background-dark dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Registro Exitoso!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión con tus credenciales.
            </p>
            <Button
              onClick={() => navigate('/login')}
              variant="primary"
              fullWidth
              className="h-12 text-base"
            >
              Ir a Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-gray-100 dark:from-background-dark dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AuditSys
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sistema de Gestión de Auditorías COBIT 5
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserPlus className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Crear Cuenta
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Completa el formulario para solicitar acceso
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="usuario@ejemplo.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol Solicitado
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors"
              >
                <option value="auditor">Auditor</option>
                <option value="audit_leader">Líder de Auditoría</option>
                <option value="process_owner">Dueño de Proceso</option>
                <option value="reviewer">Revisor</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 mt-0.5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                Acepto los{' '}
                <a href="#" className="text-primary hover:text-primary-600">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-primary hover:text-primary-600">
                  política de privacidad
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              fullWidth
              className="h-12 text-base"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-600 font-medium"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AuditSys. Sistema de gestión de auditorías basado en COBIT 5.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
