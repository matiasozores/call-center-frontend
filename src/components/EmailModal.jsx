import React, { useState, useEffect } from 'react';

const EmailModal = ({ isOpen, onClose, caseData, onSendSuccess }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); 

  useEffect(() => {
    if (caseData) {
      const newSubject = `Actualización sobre su caso: ${caseData.claimId || 'Consulta General'}`;
      const newBody = `Estimado/a ${caseData.customer || 'cliente'},

Nos comunicamos para informarle sobre el estado de su caso.

- Caso: ${caseData.status}
- Motivo: ${caseData.reason}
- Detalles: ${caseData.details}

Atentamente,
El equipo de soporte.`;
      setSubject(newSubject);
      setBody(newBody);
    }
    setSendStatus(null); 
  }, [caseData]);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setSendStatus(null);
    setTimeout(() => {
      if (Math.random() > 0.2) { 
        setSendStatus('success');
        if(onSendSuccess) onSendSuccess(caseData.id);
      } else {
        setSendStatus('error');
      }
      setIsSending(false);
      setTimeout(() => {
        if (Math.random() > 0.2) onClose(); 
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Enviar Informe por Correo</h3>
          <p className="text-sm text-slate-400">Para: {caseData.email}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-2">Asunto</label>
            <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-400 mb-2">Mensaje</label>
            <textarea id="body" rows="8" value={body} onChange={(e) => setBody(e.target.value)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"></textarea>
          </div>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-b-lg flex flex-col sm:flex-row justify-between items-center">
          <div className="w-full sm:w-auto mb-2 sm:mb-0">
            {sendStatus === 'success' && <p className="text-green-400">✓ Correo enviado exitosamente.</p>}
            {sendStatus === 'error' && <p className="text-red-400">✗ Error al enviar el correo.</p>}
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button onClick={onClose} disabled={isSending} className="w-full sm:w-auto px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors duration-300 disabled:opacity-50">
              Cancelar
            </button>
            <button onClick={handleSend} disabled={isSending} className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait">
              {isSending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;