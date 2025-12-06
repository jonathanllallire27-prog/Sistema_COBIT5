import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AuditCard from '@/components/audits/AuditCard';
import AuditList from '@/components/audits/AuditList';
import AuditForm from '@/components/audits/AuditForm';
import AuditFilters from '@/components/audits/AuditFilters';
import { auditService } from '@/services/auditService';
import { Audit } from '@/types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Audits: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const data = await auditService.getAll();
      setAudits(data);
    } catch (error) {
      console.error('Error fetching audits:', error);
      toast.error('Error al cargar las auditorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleCreateAudit = async (data: any) => {
    try {
      await auditService.create(data);
      toast.success('Auditoría creada exitosamente');
      setShowForm(false);
      fetchAudits();
    } catch (error) {
      console.error('Error creating audit:', error);
      toast.error('Error al crear la auditoría');
    }
  };

  const handleUpdateAudit = async (id: number, data: any) => {
    try {
      await auditService.update(id, data);
      toast.success('Auditoría actualizada exitosamente');
      setEditingAudit(null);
      setShowForm(false);
      fetchAudits();
    } catch (error) {
      console.error('Error updating audit:', error);
      toast.error('Error al actualizar la auditoría');
    }
  };

  const handleDeleteAudit = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta auditoría?')) return;
    
    try {
      await auditService.delete(id);
      toast.success('Auditoría eliminada exitosamente');
      fetchAudits();
    } catch (error) {
      console.error('Error deleting audit:', error);
      toast.error('Error al eliminar la auditoría');
    }
  };

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch = audit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Auditorías
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Planifique y gestione todas sus auditorías
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nueva Auditoría
        </button>
      </div>

      {/* Filtros */}
      <AuditFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Lista de auditorías */}
      <AuditList
        audits={filteredAudits}
        onView={(id) => navigate(`/audits/${id}`)}
        onEdit={(a) => { setEditingAudit(a); setShowForm(true); }}
        onDelete={(id) => handleDeleteAudit(id)}
      />

      {filteredAudits.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron auditorías
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all'
              ? 'Intenta con otros filtros'
              : 'Crea tu primera auditoría'}
          </p>
        </div>
      )}

      {/* Modal de formulario */}
      {(showForm || editingAudit) && (
        <AuditForm
          audit={editingAudit}
          onSubmit={editingAudit 
            ? (data) => handleUpdateAudit(editingAudit.id, data)
            : handleCreateAudit
          }
          onClose={() => {
            setShowForm(false);
            setEditingAudit(null);
          }}
        />
      )}
    </div>
  );
};

export default Audits;