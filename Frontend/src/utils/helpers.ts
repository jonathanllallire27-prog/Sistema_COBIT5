import { format, formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = 'PP') => {
  return format(new Date(date), formatStr, { locale: es });
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'PPpp', { locale: es });
};

export const timeAgo = (date: string | Date) => {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: es,
  });
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getRiskColor = (riskScore: number) => {
  if (riskScore >= 20) return 'bg-red-500';
  if (riskScore >= 12) return 'bg-orange-500';
  if (riskScore >= 6) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getRiskLevel = (riskScore: number) => {
  if (riskScore >= 20) return 'Crítico';
  if (riskScore >= 12) return 'Alto';
  if (riskScore >= 6) return 'Medio';
  return 'Bajo';
};

export const calculateCompliance = (assessments: any[]) => {
  const total = assessments.length;
  const compliant = assessments.filter(a => a.compliance === 'compliant').length;
  return total > 0 ? (compliant / total) * 100 : 0;
};