import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerSearch from '../components/CustomerSearch';

const getStatusBadge = (status) => {
  if (!status) return <span className="text-slate-500">-</span>;
  switch (status) {
    case 'RESUELTO':
      return <span className="px-2 py-1 text-xs font-semibold text-green-200 bg-green-900/60 border border-green-700 rounded-full">Resuelto</span>;
    case 'PENDIENTE':
      return <span className="px-2 py-1 text-xs font-semibold text-amber-200 bg-amber-900/60 border border-amber-700 rounded-full">Pendiente</span>;
    case 'EN_PROGRESO':
      return <span className="px-2 py-1 text-xs font-semibold text-cyan-200 bg-cyan-900/60 border border-cyan-700 rounded-full">En Progreso</span>;
    default:
      return <span className="px-2 py-1 text-xs font-semibold text-slate-300 bg-slate-700 rounded-full">{status}</span>;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
};


const CustomerHistoryPage = () => {
  const sectorMap = {
    1: 'Soporte Técnico',
    2: 'Facturación',
    3: 'Ventas',
    4: 'Calidad',
  };
  const [client, setClient] = useState(null);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      const fetchClaims = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await fetch(`https://web-production-fabf2.up.railway.app/claims/client/${client.id}`);
          if (response.ok) {
            const data = await response.json();
            setClaims(data);
          } else if (response.status === 404) {
            setClaims([]);
          } else {
            throw new Error('Error al cargar los reclamos.');
          }
        } catch (err) {
          setError(err.message);
          setClaims([]);
        } finally {
          setLoading(false);
        }
      };
      fetchClaims();
    } else {
      setClaims([]);
    }
  }, [client]);

  const handleCustomerSelect = (customer) => {
    if (customer) {
      setClient(customer);
      setError('');
    }
  };

  const handleClear = () => {
    setClient(null);
  };

  return (
    <main className="flex-1 p-4 md:p-10 bg-slate-800 text-gray-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Historial de Cliente</h2>

        <div className="bg-slate-900 p-4 md:p-6 rounded-lg shadow-lg mb-8">
          <CustomerSearch 
            onCustomerSelect={handleCustomerSelect}
            onClear={handleClear}
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {client && !isLoading && (
          <div className="bg-slate-900 shadow-lg rounded-lg p-4 md:p-6 overflow-hidden">
            <div className="border-b border-slate-700 pb-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{client.firstName} {client.lastName}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    ID: {client.id} | DNI: {client.dni}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-slate-400">Email: </span>
                  <span className="text-slate-300">{client.email || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Teléfono: </span>
                  <span className="text-slate-300">{client.phone || '-'}</span>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-white mb-4">Reclamos</h4>
            
            {claims.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Fecha</th>
                      <th className="px-4 py-3 text-left">Sector</th>
                      <th className="px-4 py-3 text-left">Descripción</th>
                      <th className="px-4 py-3 text-center">Nº Reclamo</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDate(claim.registrationDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{sectorMap[claim.sectorId] || 'N/A'}</td>
                        <td className="px-4 py-3">{claim.description}</td>
                        <td className="px-4 py-3 text-center">{claim.claimNumber}</td>
                        <td className="px-4 py-3">
                          {getStatusBadge(claim.status)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            to={`/claim/${claim.id}`} 
                            className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            Ver detalle
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No hay reclamos para este cliente.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CustomerHistoryPage;