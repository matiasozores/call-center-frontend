import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import RegisterCallPage from './pages/RegisterCallPage';
import ClaimTrackingPage from './pages/ClaimTrackingPage';
import ClaimDetailPage from './pages/ClaimDetailPage';
import CallTrackingPage from './pages/CallTrackingPage';
import CustomerHistoryPage from './pages/CustomerHistoryPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-slate-900 print:bg-white">
        <div className="print:hidden">
          <Header />
        </div>
        <div className="flex flex-1">
          <div className="print:hidden">
            <Sidebar />
          </div>
          <Routes>
            <Route path="/call-center-frontend/" element={<HomePage />} />
            <Route path="/call-center-frontend/register-call" element={<RegisterCallPage />} />
            <Route path="/call-center-frontend/claim-tracking" element={<ClaimTrackingPage />} />
            <Route path="/call-center-frontend/claim/:id" element={<ClaimDetailPage />} />
            <Route path="/call-center-frontend/call-tracking" element={<CallTrackingPage />} />
            <Route path="/call-center-frontend/customer-history" element={<CustomerHistoryPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
