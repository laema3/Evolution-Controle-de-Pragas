import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ServiceAreas from '../components/ServiceAreas';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import WhatsAppButton from '../components/WhatsAppButton';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans relative">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <ServiceAreas />
        <Testimonials />
      </main>
      <Footer />
      
      {/* Fixed Buttons */}
      <ChatWidget />
      <WhatsAppButton />
    </div>
  );
}
