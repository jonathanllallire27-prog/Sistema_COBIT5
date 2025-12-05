import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import clsx from 'clsx';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  showIcon?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  showIcon = true,
}) => {
  const typeConfig = {
    info: {
      icon: Info,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-300',
      iconColor: 'text-blue-500',
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-300',
      iconColor: 'text-green-500',
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-300',
      iconColor: 'text-yellow-500',
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-300',
      iconColor: 'text-red-500',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'rounded-lg border p-4',
        config.bg,
        config.border,
        config.text
      )}
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            <Icon className={clsx('h-5 w-5', config.iconColor)} />
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className="font-medium mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;