import { Bug, Rat, ShieldAlert, Droplets, SprayCan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <Bug className="w-12 h-12 text-green-600" />,
    title: 'Dedetização',
    description: 'Controle eficaz de baratas, formigas, aranhas e outros insetos rasteiros com produtos de alta qualidade e segurança.',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800'
  },
  {
    icon: <Rat className="w-12 h-12 text-green-600" />,
    title: 'Desratização',
    description: 'Eliminação de roedores através de iscas, armadilhas e mapeamento de pontos críticos para evitar reinfestação.',
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=800'
  },
  {
    icon: <ShieldAlert className="w-12 h-12 text-green-600" />,
    title: 'Descupinização',
    description: 'Tratamento especializado contra cupins de madeira seca e subterrâneos, protegendo móveis e estruturas.',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800'
  },
  {
    icon: <Droplets className="w-12 h-12 text-green-600" />,
    title: 'Limpeza de Caixa d\'Água',
    description: 'Higienização completa de reservatórios de água, seguindo rigorosos padrões sanitários para garantir a potabilidade.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    icon: <SprayCan className="w-12 h-12 text-green-600" />,
    title: 'Sanitização de Ambientes',
    description: 'Desinfecção de ambientes contra vírus, bactérias e fungos, ideal para empresas, escolas e residências.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Services() {
  const navigate = useNavigate();

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
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6 flex-1">{service.description}</p>
                <button 
                  onClick={() => navigate('/orcamento')}
                  className="w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-colors"
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
