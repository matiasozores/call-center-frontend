import React from 'react';

const Header = () => {
  return (
    <header className="bg-slate-900 text-gray-200 px-6 py-4 flex justify-between items-center border-b border-slate-700">
      <div>
        <h1 className="text-lg font-semibold tracking-wider">Sistema de Soporte Técnico</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm">Operador: Matías Ozores</span>
        <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-800 rounded-md hover:bg-slate-700 focus:outline-none transition-colors duration-200 cursor-pointer border-none">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;