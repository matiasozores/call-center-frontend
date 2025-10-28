import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Resuelto':
      return <span className="px-2 py-1 text-xs font-semibold text-green-200 bg-green-900/60 border border-green-700 rounded-full">{status}</span>;
    case 'Pendiente':
      return <span className="px-2 py-1 text-xs font-semibold text-amber-200 bg-amber-900/60 border border-amber-700 rounded-full">{status}</span>;
    case 'En Progreso':
      return <span className="px-2 py-1 text-xs font-semibold text-cyan-200 bg-cyan-900/60 border border-cyan-700 rounded-full">{status}</span>;
    default:
      return <span className="px-2 py-1 text-xs font-semibold text-slate-300 bg-slate-700 rounded-full">{status}</span>;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const ClaimTrackingPage = () => {
  const [claims, setClaims] = useState([]);
  const [clients, setClients] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sectorMap = {
    1: 'Soporte Técnico',
    2: 'Facturacion',
    3: 'Ventas',
    4: 'Calidad',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [claimsRes, clientsRes] = await Promise.all([
          fetch('https://web-production-fabf2.up.railway.app/claims'),
          fetch('https://web-production-fabf2.up.railway.app/clients')
        ]);

        if (!claimsRes.ok || !clientsRes.ok) {
          throw new Error('Error al cargar los datos');
        }

        const claimsData = await claimsRes.json();
        const clientsData = await clientsRes.json();
        
        const clientsMap = clientsData.reduce((acc, client) => {
          acc[client.id] = `${client.firstName} ${client.lastName}`;
          return acc;
        }, {});

        setClaims(claimsData);
        setClients(clientsMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClaims = useMemo(() => {
    if (!searchTerm) {
      return claims;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return claims.filter(claim => {
      const clientName = clients[claim.clientId] || '';
      return (
        (claim.claimNumber && String(claim.claimNumber).toLowerCase().includes(lowercasedFilter)) ||
        (clientName && clientName.toLowerCase().includes(lowercasedFilter))
      );
    });
  }, [claims, clients, searchTerm]);

  return (
    <main className="flex-1 p-10 bg-slate-800 text-gray-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Seguimiento de Reclamos</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por Nº de reclamo o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>

        <div className="bg-slate-900 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left">
              <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3">Nº Reclamo</th>
                  <th scope="col" className="px-6 py-3">Cliente</th>
                  <th scope="col" className="px-6 py-3">Sector</th>
                  <th scope="col" className="px-6 py-3">Estado</th>
                  <th scope="col" className="px-6 py-3">Fecha de Apertura</th>
                  <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan="6" className="text-center py-10">Cargando reclamos...</td></tr>
                ) : error ? (
                  <tr><td colSpan="6" className="text-center py-10 text-red-400">Error: {error}</td></tr>
                ) : filteredClaims.length > 0 ? (
                  filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-800/40 transition-colors duration-200">
                      <td className="px-6 py-4 font-medium text-cyan-400 whitespace-nowrap">{claim.claimNumber}</td>
                      <td className="px-6 py-4 text-white whitespace-nowrap">{clients[claim.clientId] || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{sectorMap[claim.sectorId] || 'N/A'}</td>
                      <td className="px-6 py-4">{getStatusBadge(claim.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(claim.registrationDate)}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                        <Link to={`/claim/${claim.id}`} className="font-medium text-indi  go-400 hover:text-indigo-300">Ver detalle</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-10">No se encontraron reclamos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClaimTrackingPage;