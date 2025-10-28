import React, { useState, useEffect } from 'react';
import CustomerSearch from '../components/CustomerSearch';

const VerificationMessage = ({ status }) => {
  if (!status) return null;

  const messages = {
    valid: {
      text: 'Cliente válido.',
      color: 'text-green-400',
    },
    debtor: {
      text: 'No puede generar reclamo. Estado: deudor.',
      color: 'text-red-400',
    },
    incorrect: {
      text: 'Verificar datos del cliente.',
      color: 'text-amber-400',
    },
  };

  const { text, color } = messages[status.toLowerCase()] || {};

  return (
    <div className={`flex items-center p-3 my-4 rounded-md bg-slate-800/50 border border-slate-700 ${color}`}>
      <p className="font-semibold">{text}</p>
    </div>
  );
};

const RegisterCallPage = () => {
  const [flowStep, setFlowStep] = useState('selection');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [problemReason, setProblemReason] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [generateClaim, setGenerateClaim] = useState(false);
  const [claimSector, setClaimSector] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [claimStatus, setClaimStatus] = useState('Pendiente');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (generateClaim) {
      const newClaimNumber = `${Math.floor(100000 + Math.random() * 900000)}`;
      setClaimNumber(newClaimNumber);
      setClaimStatus('Pendiente');
    } else {
      setClaimSector('');
      setClaimNumber('');
    }
  }, [generateClaim]);

  useEffect(() => {
    if (selectedCustomer) {
      setGenerateClaim(selectedCustomer.status !== 'debtor');
    }
  }, [selectedCustomer]);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFirstName(customer.firstName);
    setLastName(customer.lastName);
    setPhone(customer.phone || '');
    setAddress(customer.address);
    setEmail(customer.email);
    setDni(customer.dni);
    setStatus(customer.status);
    setFormErrors({});
  };

  const handleClear = () => {
    setSelectedCustomer(null);
    setFirstName('');
    setLastName('');
    setPhone('');
    setAddress('');
    setEmail('');
    setDni('');
    setProblemReason('');
    setGenerateClaim(false);
    setStatus(null);
    setFormErrors({});
  };

  const resetFlow = () => {
    handleClear();
    setFlowStep('selection');
    setError('');
    setSuccessMessage('');
  }

  const validate = () => {
    const errors = {};
    if (flowStep === 'newCustomer') {
      if (!firstName || firstName.length < 3) errors.firstName = 'El nombre debe tener al menos 3 caracteres.';
      if (!lastName || lastName.length < 3) errors.lastName = 'El apellido debe tener al menos 3 caracteres.';
      if (!dni.match(/^[0-9]{7,8}$/)) errors.dni = 'DNI inválido.';
      if (!phone.match(/^[0-9]+$/) || phone.length < 8) errors.phone = 'Teléfono inválido.';
      if (!address) errors.address = 'La dirección es obligatoria.';
      if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Email inválido.';
    }
    if (!problemReason) errors.problemReason = 'El motivo del problema es obligatorio.';
    if (generateClaim && !claimSector) errors.claimSector = 'El sector es obligatorio.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      let customerToProcess = selectedCustomer;

      if (flowStep === 'newCustomer') {
        const clientData = { firstName, lastName, dni, phone, address, email, registrationDate: new Date() };
        const response = await fetch('https://web-production-fabf2.up.railway.app/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData),
        });

        if (!response.ok) {
          throw new Error('Error al registrar el nuevo cliente.');
        }
        customerToProcess = await response.json();
      }

      if (!customerToProcess) {
        throw new Error("No se ha seleccionado o creado un cliente para procesar.");
      }

      const callData = {
        idClient: customerToProcess.id,
        callDescription: problemReason,
      };

      const callResponse = await fetch('https://web-production-fabf2.up.railway.app/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callData),
      });

      if (!callResponse.ok) {
        throw new Error('Falló el registro de la llamada.');
      }

      let responseMessage = 'Llamada registrada exitosamente.';

      if (generateClaim) {
        const sectorMap = {
          'Soporte Técnico': 1,
          'Facturación': 2,
          'Ventas': 3,
          'Calidad': 4,
        };

        const claimData = {
          clientId: customerToProcess.id,
          sectorId: sectorMap[claimSector],
          description: problemReason,
          claimNumber: claimNumber,
          status: claimStatus,
          registrationDate: new Date(),
        };

        const claimResponse = await fetch('https://web-production-fabf2.up.railway.app/claims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(claimData),
        });

        if (!claimResponse.ok) {
          throw new Error('Falló el registro del reclamo.');
        }
        
        responseMessage = 'Llamada y reclamo registrados exitosamente.';
      }

      setSuccessMessage(responseMessage);
      setTimeout(() => resetFlow(), 2000);

    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (flowStep) {
      case 'newCustomer':
      case 'existingCustomer':
        return (
          <form onSubmit={handleSubmit}>
            {flowStep === 'existingCustomer' && (
              <>
                <CustomerSearch onCustomerSelect={handleCustomerSelect} onClear={handleClear} />
                {selectedCustomer && <VerificationMessage status={selectedCustomer.status} />}
              </>
            )}

            {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}
            {successMessage && <div className="bg-green-500 text-white p-3 rounded-md mb-4">{successMessage}</div>}

            <div className={`transition-opacity duration-500 ${selectedCustomer || flowStep === 'newCustomer' ? 'opacity-100' : 'opacity-50'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-4 border-t border-slate-800">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-400 mb-2">Nombre</label>
                  <input type="text" id="firstName" value={firstName} readOnly={flowStep === 'existingCustomer'} onChange={(e) => setFirstName(e.target.value)} className={`w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white ${flowStep === 'existingCustomer' ? 'cursor-not-allowed bg-slate-700/50' : 'focus:ring-2 focus:ring-indigo-500'}`} />
                  {formErrors.firstName && <div className="text-red-400 text-sm mt-1">{formErrors.firstName}</div>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-400 mb-2">Apellido</label>
                  <input type="text" id="lastName" value={lastName} readOnly={flowStep === 'existingCustomer'} onChange={(e) => setLastName(e.target.value)} className={`w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white ${flowStep === 'existingCustomer' ? 'cursor-not-allowed bg-slate-700/50' : 'focus:ring-2 focus:ring-indigo-500'}`} />
                  {formErrors.lastName && <div className="text-red-400 text-sm mt-1">{formErrors.lastName}</div>}
                </div>
                <div>
                  <label htmlFor="dni" className="block text-sm font-medium text-slate-400 mb-2">DNI</label>
                  <input type="text" id="dni" value={dni} readOnly={flowStep === 'existingCustomer'} onChange={(e) => setDni(e.target.value)} className={`w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white ${flowStep === 'existingCustomer' ? 'cursor-not-allowed bg-slate-700/50' : 'focus:ring-2 focus:ring-indigo-500'}`} />
                  {formErrors.dni && <div className="text-red-400 text-sm mt-1">{formErrors.dni}</div>}
                </div>
                 <div className='md:col-span-1'>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-400 mb-2">Teléfono</label>
                  <input type="text" id="phone" value={phone} readOnly={flowStep === 'existingCustomer'} onChange={(e) => setPhone(e.target.value)} className={`w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white ${flowStep === 'existingCustomer' ? 'cursor-not-allowed bg-slate-700/50' : 'focus:ring-2 focus:ring-indigo-500'}`} />
                  {formErrors.phone && <div className="text-red-400 text-sm mt-1">{formErrors.phone}</div>}
                </div>
                <div className='md:col-span-2'>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-400 mb-2">Dirección</label>
                  <input type="text" id="address" value={address} readOnly={flowStep === 'existingCustomer'} onChange={(e) => setAddress(e.target.value)} className={`w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white ${flowStep === 'existingCustomer' ? 'cursor-not-allowed bg-slate-700/50' : 'focus:ring-2 focus:ring-indigo-500'}`} />
                  {formErrors.address && <div className="text-red-400 text-sm mt-1">{formErrors.address}</div>}
                </div>
                <div className="md:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input type="email" id="email" value={email} readOnly={flowStep === 'existingCustomer'} onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white ${flowStep === 'existingCustomer' ? 'cursor-not-allowed bg-slate-700/50' : 'focus:ring-2 focus:ring-indigo-500'}`} />
                  {formErrors.email && <div className="text-red-400 text-sm mt-1">{formErrors.email}</div>}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="problemReason" className="block text-sm font-medium text-slate-400 mb-2">Motivo del Problema</label>
                <textarea id="problemReason" rows="4" value={problemReason} onChange={(e) => setProblemReason(e.target.value)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"></textarea>
                {formErrors.problemReason && <div className="text-red-400 text-sm mt-1">{formErrors.problemReason}</div>}
              </div>

              <div className="mb-6 p-4 border border-slate-700 rounded-lg">
                <div className="flex items-center">
                  <input
                    id="generate-claim-checkbox"
                    type="checkbox"
                    checked={generateClaim}
                    disabled={selectedCustomer?.status === 'debtor'}
                    onChange={(e) => setGenerateClaim(e.target.checked)}
                    className="h-4 w-4 bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500 rounded disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <label htmlFor="generate-claim-checkbox" className="ml-3 block text-sm font-medium text-white">¿Generar reclamo para seguimiento?</label>
                </div>
              </div>

              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${generateClaim ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <label htmlFor="claimSector" className="block text-sm font-medium text-slate-400 mb-2">Seleccionar Sector/Área</label>
                    <select id="claimSector" value={claimSector} onChange={(e) => setClaimSector(e.target.value)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white">
                      <option value="" disabled>Seleccione un área...</option>
                      <option value="Soporte Técnico">Soporte Técnico</option>
                      <option value="Facturación">Facturación</option>
                      <option value="Ventas">Ventas</option>
                      <option value="Calidad">Calidad</option>
                    </select>
                    {formErrors.claimSector && <div className="text-red-400 text-sm mt-1">{formErrors.claimSector}</div>}
                  </div>
                  <div>
                    <label htmlFor="claimNumber" className="block text-sm font-medium text-slate-400 mb-2">Número de Reclamo</label>
                    <input type="text" id="claimNumber" value={claimNumber} readOnly className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-400 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button type="button" onClick={resetFlow} className="w-full md:w-auto px-6 py-3 font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors duration-300">
                  Cancelar
                </button>
                <button type="submit" className="w-full md:flex-1 bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500">
                  {generateClaim ? 'Registrar Llamada y Reclamo' : 'Registrar Solo Llamada'}
                </button>
              </div>
            </div>
          </form>
        );
      case 'selection':
      default:
        return (
          <div className="text-center">
            <p className="text-slate-400 mb-6">Seleccione una opción para continuar.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button onClick={() => setFlowStep('newCustomer')} className="bg-slate-800/70 p-8 rounded-lg shadow-lg hover:bg-slate-700/50 hover:scale-105 transition-all duration-300 border border-slate-700 cursor-pointer">
                <h3 className="text-2xl font-semibold text-white">Nuevo Cliente</h3>
                <p className="mt-2 text-slate-400">Registrar un cliente por primera vez.</p>
              </button>
              <button onClick={() => setFlowStep('existingCustomer')} className="bg-slate-800/70 p-8 rounded-lg shadow-lg hover:bg-slate-700/50 hover:scale-105 transition-all duration-300 border border-slate-700 cursor-pointer">
                <h3 className="text-2xl font-semibold text-white">Cliente Existente</h3>
                <p className="mt-2 text-slate-400">Buscar y verificar un cliente registrado.</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 p-10 bg-slate-800 text-gray-300">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Registrar Nueva Llamada</h2>
        <div className="bg-slate-900 p-8 rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default RegisterCallPage;