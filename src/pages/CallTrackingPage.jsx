import React, { useState, useEffect, useMemo } from 'react';

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

const CallDescriptionModal = ({ description, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
    <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-lg w-full mx-4">
      <h3 className="text-2xl font-bold text-white mb-6">Descripción de la Llamada</h3>
      <p className="text-slate-300 mb-8 whitespace-pre-wrap">{description}</p>
      <button 
        onClick={onClose} 
        className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 cursor-pointer"
      >
        Cerrar
      </button>
    </div>
  </div>
);

const CallTrackingPage = () => {
  const [calls, setCalls] = useState([]);
  const [clients, setClients] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callsRes, clientsRes] = await Promise.all([
          fetch('https://web-production-fabf2.up.railway.app/calls'),
          fetch('https://web-production-fabf2.up.railway.app/clients')
        ]);

        if (!callsRes.ok || !clientsRes.ok) {
          throw new Error('Error al cargar los datos');
        }

        const callsData = await callsRes.json();
        const clientsData = await clientsRes.json();
        
        const clientsMap = clientsData.reduce((acc, client) => {
          acc[client.id] = `${client.firstName} ${client.lastName}`;
          return acc;
        }, {});

        setCalls(callsData);
        setClients(clientsMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCalls = useMemo(() => {
    if (!searchTerm) {
      return calls;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return calls.filter(call => {
      const clientName = clients[call.idClient] || '';
      return (
        (call.id && call.id.toString().toLowerCase().includes(lowercasedFilter)) ||
        (clientName && clientName.toLowerCase().includes(lowercasedFilter)) ||
        (call.callDescription && call.callDescription.toLowerCase().includes(lowercasedFilter))
      );
    });
  }, [calls, clients, searchTerm]);

  return (
    <main className="flex-1 p-10 bg-slate-800 text-gray-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Seguimiento de Llamadas</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por ID de llamada, cliente o descripción..."
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
                  <th scope="col" className="px-6 py-3">ID Llamada</th>
                  <th scope="col" className="px-6 py-3">Cliente</th>
                  <th scope="col" className="px-6 py-3">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-center">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-10">Cargando llamadas...</td></tr>
                ) : error ? (
                  <tr><td colSpan="4" className="text-center py-10 text-red-400">Error: {error}</td></tr>
                ) : filteredCalls.length > 0 ? (
                  filteredCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-slate-800/40 transition-colors duration-200">
                      <td className="px-6 py-4 font-medium text-cyan-400 whitespace-nowrap">{call.id}</td>
                      <td className="px-6 py-4 text-white whitespace-nowrap">{clients[call.idClient] || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(call.date)}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button onClick={() => setSelectedCall(call)} className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer">Ver descripción</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center py-10">No se encontraron llamadas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedCall && <CallDescriptionModal description={selectedCall.callDescription} onClose={() => setSelectedCall(null)} />}
    </main>
  );
};

export default CallTrackingPage;
