import { Bug, Rat, ShieldAlert, Droplets, SprayCan, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const iconMap: any = {
  Bug: <Bug className="w-12 h-12 text-purple-600" />,
  Rat: <Rat className="w-12 h-12 text-purple-600" />,
  ShieldAlert: <ShieldAlert className="w-12 h-12 text-purple-600" />,
  Droplets: <Droplets className="w-12 h-12 text-purple-600" />,
  SprayCan: <SprayCan className="w-12 h-12 text-purple-600" />,
};

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (data.length > 0) {
          setServices(data);
        } else {
          // Fallback
          setServices([
            {
              id: '1',
              icon: 'Bug',
              title: 'Dedetização',
              description: 'Controle eficaz de baratas, formigas, aranhas e outros insetos rasteiros.',
              image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800'
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="py-20 text-center">Carregando serviços...</div>;

  return (
    <section className="py-20 bg-gray-50" id="servicos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nossos Serviços</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos soluções completas em controle de pragas e higienização, 
            utilizando as melhores técnicas e produtos do mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                {service.image ? (
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="text-gray-300">
                    {iconMap[service.icon] || <HelpCircle className="w-16 h-16" />}
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  {iconMap[service.icon] || <HelpCircle className="w-12 h-12 text-purple-600" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6 flex-1">{service.description}</p>
                <button 
                  onClick={() => navigate('/orcamento')}
                  className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
                >
                  Pedir Orçamento
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
