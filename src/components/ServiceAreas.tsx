import { MapPin } from 'lucide-react';

const cities = [
  'São Paulo',
  'Guarulhos',
  'Campinas',
  'São Bernardo do Campo',
  'Santo André',
  'Osasco',
  'Sorocaba',
  'Ribeirão Preto',
  'São José dos Campos',
  'Santos',
  'Diadema',
  'Jundiaí'
];

export default function ServiceAreas() {
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
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors group cursor-default"
            >
              <MapPin className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700 group-hover:text-green-700">{city}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Não encontrou sua cidade? <a href="/orcamento" className="text-green-600 font-semibold hover:underline">Entre em contato</a> para verificar disponibilidade.
          </p>
        </div>
      </div>
    </section>
  );
}
