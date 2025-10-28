import React, { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'https://web-production-fabf2.up.railway.app/clients';

const CustomerSearch = ({ onCustomerSelect, onClear }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef(null);
  const suppressNextSearch = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCustomers = async (searchTerm) => {
    if (searchTerm.length < 2) return [];
    if (searchTerm.includes('(') || searchTerm.includes(')')) return [];

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(searchTerm)}`);

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error('Error al buscar clientes');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [data];

    } catch (err) {
      console.error('Error searching customers:', err);
      setError('Error al buscar clientes. Intente nuevamente.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (suppressNextSearch.current) {
        suppressNextSearch.current = false;
        return;
      }

      const q = debouncedQuery;
      if (selectedCustomer) {
        return;
      }

      if (q.length > 1) {
        const results = await searchCustomers(q);
        if (cancelled) return;
        setSuggestions(results);
        setIsDropdownVisible(results.length > 0);
      } else {
        setSuggestions([]);
        setIsDropdownVisible(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selectedCustomer]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedCustomer(null);
    onClear();
  };

  const handleSelectCustomer = (customer) => {
    suppressNextSearch.current = true;
    setQuery(`${customer.firstName} ${customer.lastName} (${customer.dni || customer.id})`);
    setDebouncedQuery('');
    setSelectedCustomer(customer);
    setSuggestions([]);
    setIsDropdownVisible(false);
    onCustomerSelect(customer);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          id="customer-search"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsDropdownVisible(true)}
          placeholder="Buscar por DNI, nombre o apellido..."
          className="w-full pl-10 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          </div>
        )}
        {!isLoading && selectedCustomer && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-green-500">✓</span>
          </div>
        )}
        {!isLoading && !selectedCustomer && query.length > 1 && suggestions.length === 0 && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-red-500">✗</span>
          </div>
        )}
      </div>

      {isDropdownVisible && (
        <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map((customer) => (
                <li
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className="px-4 py-2 hover:bg-slate-800 cursor-pointer text-white"
                >
                  <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                  <div className="text-sm text-slate-400">
                    {customer.dni && `DNI: ${customer.dni} • `}ID: {customer.id}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-slate-400">No se encontraron clientes.</div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-1 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
};

export default CustomerSearch;