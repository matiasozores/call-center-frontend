import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import UpdateStatusModal from '../components/UpdateStatusModal';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Resuelto':
      return <span className="px-3 py-1 text-sm font-semibold text-green-200 bg-green-900/60 border border-green-700 rounded-full">Resuelto</span>;
    case 'Pendiente':
      return <span className="px-3 py-1 text-sm font-semibold text-amber-200 bg-amber-900/60 border border-amber-700 rounded-full">Pendiente</span>;
    case 'En progreso':
      return <span className="px-3 py-1 text-sm font-semibold text-cyan-200 bg-cyan-900/60 border border-cyan-700 rounded-full">En Progreso</span>;
    default:
      return <span className="px-3 py-1 text-sm font-semibold text-slate-300 bg-slate-700 rounded-full">{status}</span>;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  });
};

const ClaimDetailPage = () => {
  const sectorMap = {
    1: 'Soporte Técnico',
    2: 'Facturación',
    3: 'Ventas',
    4: 'Calidad',
  };
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClaimData = async () => {
      try {
        const claimRes = await fetch(`https://web-production-fabf2.up.railway.app/claims/${id}`);
        if (!claimRes.ok) throw new Error('No se pudo cargar el reclamo.');
        const claimData = await claimRes.json();
        setClaim(claimData);

        if (claimData.clientId) {
          const clientRes = await fetch(`https://web-production-fabf2.up.railway.app/${claimData.clientId}`);
          if (!clientRes.ok) throw new Error('No se pudo cargar el cliente.');
          const clientData = await clientRes.json();
          setClient(clientData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaimData();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    const updatedClaim = { ...claim, status: newStatus };

    try {
      const response = await fetch(`https://web-production-fabf2.up.railway.app/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClaim),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado.');
      }

      const data = await response.json();
      setClaim(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-slate-800 text-white w-full text-2xl">Cargando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-slate-800 text-red-400">Error: {error}</div>;
  }

  if (!claim) {
    return <div className="flex justify-center items-center h-screen bg-slate-800 text-white">Reclamo no encontrado.</div>;
  }

  return (
    <main className="flex-1 p-10 bg-slate-800 text-gray-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Detalle del Reclamo</h2>
          <span className="font-semibold text-cyan-400 tracking-wider">{claim.claimNumber}</span>
        </div>

        <div className="bg-slate-900 shadow-lg rounded-lg p-8">
          {client && (
            <div className="border-b border-slate-700 pb-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Información del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <p className="text-slate-400">Nombre</p>
                  <p className="text-white font-medium text-base">{`${client.firstName} ${client.lastName}`}</p>
                </div>
                <div>
                  <p className="text-slate-400">Número de Cliente</p>
                  <p className="text-white font-medium text-base">{client.id}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <div className="md:col-span-2">
              <p className="text-slate-400">Motivo del Reclamo</p>
              <p className="text-white font-medium text-base mt-1">{claim.description}</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400">Sector Asignado</p>
                <p className="text-white font-medium text-base">{sectorMap[claim.sectorId] || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Fecha de Registro</p>
                <p className="text-white font-medium text-base">{formatDate(claim.registrationDate)}</p>
              </div>
              <div>
                <p className="text-slate-400">Estado Actual</p>
                <div className="mt-1">{getStatusBadge(claim.status)}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row items-center justify-end gap-4">
            <Link to="/claim-tracking" className="w-full md:w-auto text-center px-6 py-2 font-semibold text-slate-300 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors duration-300">
              Volver al Seguimiento
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300 cursor-pointer"
            >
              Actualizar Estado
            </button>
          </div>
        </div>
        {isModalOpen && (
          <UpdateStatusModal
            claim={claim}
            onClose={() => setIsModalOpen(false)}
            onUpdate={handleUpdateStatus}
          />
        )}
      </div>
    </main>
  );
};

export default ClaimDetailPage;