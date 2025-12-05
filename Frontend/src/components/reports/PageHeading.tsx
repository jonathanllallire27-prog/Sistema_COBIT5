import React from 'react';
import { Download } from 'lucide-react';
import Button from '@/components/common/Button';

interface PageHeadingProps {
  title: string;
  description: string;
  onExport: () => void;
}

const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  description,
  onExport,
}) => {
  return (
    <div className="flex flex-wrap justify-between gap-4 items-start mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
          {description}
        </p>
      </div>
      <Button
        onClick={onExport}
        icon={Download}
        variant="primary"
        className="flex items-center gap-2"
      >
        <span className="truncate">Exportar</span>
      </Button>
    </div>
  );
};

export default PageHeading;