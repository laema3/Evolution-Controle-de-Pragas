import { MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function ServiceAreas() {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const q = query(collection(db, 'cities'), orderBy('name'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data().name);
        
        if (data.length > 0) {
          setCities(data.sort((a, b) => a.localeCompare(b, 'pt-BR')));
        } else {
          // Fallback
          const fallbackCities = ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo'];
          setCities(fallbackCities.sort((a, b) => a.localeCompare(b, 'pt-BR')));
        }
      } catch (error) {
        console.error("Error fetching cities: ", error);
        // Fallback on error
        const fallbackCities = ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo'];
        setCities(fallbackCities.sort((a, b) => a.localeCompare(b, 'pt-BR')));
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 bg-white" id="atendimento">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Áreas de Atendimento</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Atendemos diversas regiões com rapidez e eficiência. Confira as principais cidades onde atuamos.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors group cursor-default"
            >
              <MapPin className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700 group-hover:text-purple-700">{city}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Não encontrou sua cidade? <a href="/orcamento" className="text-purple-600 font-semibold hover:underline">Entre em contato</a> para verificar disponibilidade.
          </p>
        </div>
      </div>
    </section>
  );
}
