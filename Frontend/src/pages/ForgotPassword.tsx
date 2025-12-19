import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            toast.error('Por favor ingresa tu correo electrónico');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Ingresa un correo electrónico válido');
            return;
        }

        try {
            setIsLoading(true);

            // Simulación de envío de correo - En producción conectar con el backend
            // await api.post('/auth/forgot-password', { email });

            // Simulamos un delay para mostrar el loading
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitted(true);
            toast.success('Instrucciones enviadas a tu correo');

        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al procesar la solicitud');
            toast.error('Error al enviar las instrucciones');
        } finally {
            setIsLoading(false);
        }
    };

    // Pantalla de éxito después de enviar
    if (isSubmitted) {
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
                    </div>

                    {/* Success Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            ¡Correo Enviado!
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Hemos enviado las instrucciones para restablecer tu contraseña a:
                        </p>

                        <p className="font-mono text-primary bg-primary/10 px-4 py-2 rounded-lg mb-6">
                            {email}
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="text-left">
                                    <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                        Importante
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                        Si no recibes el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                }}
                                variant="outline"
                                fullWidth
                            >
                                Enviar de nuevo
                            </Button>

                            <Link to="/login" className="block">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    className="h-12 text-base"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver a Iniciar Sesión
                                </Button>
                            </Link>
                        </div>
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

                {/* Forgot Password Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                            <Mail className="h-7 w-7 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            ¿Olvidaste tu contraseña?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            No te preocupes, te enviaremos instrucciones para restablecerla.
                        </p>
                    </div>

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

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isLoading}
                            fullWidth
                            className="h-12 text-base"
                            icon={Send}
                        >
                            {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Volver a Iniciar Sesión</span>
                        </Link>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        ¿Necesitas ayuda?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Si tienes problemas para acceder a tu cuenta, contacta al administrador del sistema.
                    </p>
                    <div className="flex flex-col gap-2 text-sm">
                        <a
                            href="mailto:soporte@auditsys.com"
                            className="text-primary hover:text-primary-600 font-medium"
                        >
                            📧 soporte@auditsys.com
                        </a>
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

export default ForgotPassword;
