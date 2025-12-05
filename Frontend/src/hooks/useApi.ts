import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall(...args);
        setData(result);
        
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || options.errorMessage || 'Error';
        setError(message);
        
        if (options.errorMessage || err.message) {
          toast.error(options.errorMessage || err.message);
        }
        
        if (options.onError) {
          options.onError(err);
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}