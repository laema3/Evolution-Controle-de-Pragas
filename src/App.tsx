import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import QuoteRequestPage from './pages/QuoteRequestPage';
import GlobalLoader from './components/GlobalLoader';

// Admin Pages (Placeholders for now)
import ServicesAdmin from './pages/admin/ServicesAdmin';
import CitiesAdmin from './pages/admin/CitiesAdmin';
import CarouselAdmin from './pages/admin/CarouselAdmin';
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin';
import QuotesAdmin from './pages/admin/QuotesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button');
      if (target) {
        setIsLoading(true);
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
        <Route path="/orcamento" element={<QuoteRequestPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<QuotesAdmin />} /> {/* Default to quotes */}
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="cities" element={<CitiesAdmin />} />
          <Route path="carousel" element={<CarouselAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="quotes" element={<QuotesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}
