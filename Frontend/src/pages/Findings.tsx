import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, FileText } from 'lucide-react';
import { useAudit } from '@/hooks/useAudit';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Findings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { audit, findings, loading, error, refetch } = useAudit(id ? parseInt(id) : undefined);
  const goToAudits = () => {
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate('/audits');
    } catch {
      navigate('/audits');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !audit) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {error || 'Auditoría no encontrada'}
        </h3>
        <Button onClick={goToAudits} variant="outline">
          Volver a Auditorías
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hallazgos - Auditoría de sistemas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Lista de hallazgos para esta auditoría</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(`/audits/${audit.id}`)}>Atrás</Button>
          <Button variant="outline" onClick={() => refetch()}>Actualizar</Button>
          <Button variant="primary" onClick={() => navigate(`/audits/${audit.id}/findings/new`)}>
            <FileText className="h-4 w-4 mr-2" />
            Nuevo Hallazgo
          </Button>
        </div>
      </div>

      {findings.length > 0 ? (
        <div className="space-y-4">
          {findings.map((f) => (
            <div
              key={f.id}
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/audits/${audit.id}/findings/${f.id}/edit`)}>
                  <h3 className="font-medium text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{f.description || 'Sin descripción'}</p>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400 flex flex-col items-end gap-2">
                  <div>{f.status}</div>
                  <div>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const ok = confirm('¿Eliminar este hallazgo? Esta acción no se puede deshacer.');
                        if (!ok) return;
                        try {
                          await auditService.deleteFinding(f.id);
                          // actualizar lista local
                          await refetch();
                        } catch (err) {
                          console.error('Error eliminando hallazgo:', err);
                          alert('Error al eliminar hallazgo');
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron hallazgos</h3>
          <p className="text-gray-500 dark:text-gray-400">Puedes crear uno nuevo para esta auditoría.</p>
        </div>
      )}
    </div>
  );
};

export default Findings;
