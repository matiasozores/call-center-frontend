import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className="flex-1 bg-slate-800 text-gray-300 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-4xl mx-auto text-center">
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Sistema de Soporte al Cliente</h1>
          <p className="mt-4 text-lg text-slate-400">Gestione llamadas, reclamos y clientes de manera eficiente.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <Link to="/register-call" className="bg-slate-900/70 p-8 rounded-lg shadow-lg hover:bg-slate-700/50 hover:scale-105 transition-all duration-300 border border-slate-700">
            <h3 className="text-2xl font-semibold text-white">Registrar Llamada</h3>
            <p className="mt-2 text-slate-400">Inicia un nuevo registro de atención.</p>
          </Link>
          <Link to="/claim-tracking" className="bg-slate-900/70 p-8 rounded-lg shadow-lg hover:bg-slate-700/50 hover:scale-105 transition-all duration-300 border border-slate-700">
            <h3 className="text-2xl font-semibold text-white">Ver Reclamos</h3>
            <p className="mt-2 text-slate-400">Consulta y gestiona los reclamos existentes.</p>
          </Link>
        </div>

      </div>
    </main>
  );
};

export default HomePage;