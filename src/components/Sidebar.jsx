import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const activeLinkClass = "bg-slate-800 text-white";
  const inactiveLinkClass = "hover:bg-slate-800 hover:text-white";

  return (
    <aside className="bg-slate-900 text-gray-300 w-64 p-6 border-r border-slate-700 flex flex-col h-full">
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavLink to="/call-center-frontend/" className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} w-full text-left py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200`}>Inicio</NavLink>
        <NavLink to="/call-center-frontend/register-call" className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} w-full text-left py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200`}>Registrar llamada</NavLink>
        <NavLink to="/call-center-frontend/customer-history" className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} w-full text-left py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200`}>Historial de Cliente</NavLink>
        <NavLink to="/call-center-frontend/claim-tracking" className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} w-full text-left py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200`}>Seguimiento de Reclamos</NavLink>
        <NavLink to="/call-center-frontend/call-tracking" className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} w-full text-left py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200`}>Seguimiento de Llamadas</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
