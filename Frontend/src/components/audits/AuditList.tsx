import React from 'react';
import { Audit } from '@/types';
import AuditCard from './AuditCard';

interface AuditListProps {
	audits: Audit[];
	onView: (id: number) => void;
	onEdit: (audit: Audit) => void;
	onDelete: (id: number) => void;
}

const AuditList: React.FC<AuditListProps> = ({ audits, onView, onEdit, onDelete }) => {
	if (!audits || audits.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 dark:text-gray-400">No se encontraron auditorías</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{audits.map(audit => (
				<AuditCard
					key={audit.id}
					audit={audit}
					onView={() => onView(audit.id)}
					onEdit={() => onEdit(audit)}
					onDelete={() => onDelete(audit.id)}
				/>
			))}
		</div>
	);
};

export default AuditList;
