/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import QuoteRequestPage from './pages/QuoteRequestPage';
import GlobalLoader from './components/GlobalLoader';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Verifica se o clique foi em um link ou botão
      const target = (e.target as HTMLElement).closest('a, button');
      if (target) {
        setIsLoading(true);
        // Esconde o loader após 800ms para simular o carregamento
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <Router>
      {isLoading && <GlobalLoader />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/orcamento" element={<QuoteRequestPage />} />
      </Routes>
    </Router>
  );
}
