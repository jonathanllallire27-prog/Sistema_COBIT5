import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Ingresa tus credenciales para acceder
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="pl-10"
                  required
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Recordarme
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-600"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              fullWidth
              className="h-12 text-base"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Credenciales de Demostración:
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Email: <span className="font-mono">admin@cobit.com</span></p>
              <p>Contraseña: <span className="font-mono">admin123</span></p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-600 font-medium"
              >
                Solicitar acceso
              </Link>
            </p>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AuditSys. Sistema de gestión de auditorías basado en COBIT 5.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            v1.0.0 • Para uso académico
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;