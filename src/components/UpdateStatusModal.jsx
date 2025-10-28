import React, { useState } from 'react';

const UpdateStatusModal = ({ claim, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(claim.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(newStatus);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-white mb-6">Actualizar Estado del Reclamo</h3>
        <div className="mb-6">
          <label htmlFor="status-select" className="block text-sm font-medium text-slate-400 mb-2">Nuevo Estado</label>
          <select
            id="status-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors cursor-pointer"
            disabled={isUpdating}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
            disabled={isUpdating}
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
