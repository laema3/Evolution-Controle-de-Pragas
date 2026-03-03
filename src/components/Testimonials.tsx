import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Gerente de Condomínio',
    content: 'A Evolution Controle de Pragas transformou nosso condomínio. O atendimento foi rápido e o problema com formigas foi resolvido definitivamente. Recomendo!',
    rating: 5
  },
  {
    name: 'Ana Paula Souza',
    role: 'Proprietária de Restaurante',
    content: 'Serviço impecável! A equipe é muito profissional e cuidadosa. Fazemos a manutenção mensal e nunca mais tivemos problemas com pragas.',
    rating: 5
  },
  {
    name: 'Roberto Mendes',
    role: 'Residência',
    content: 'Contratei para descupinização e fiquei muito satisfeito. Explicaram todo o processo e o preço foi justo. O resultado foi excelente.',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-green-900 text-white" id="depoimentos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Dizem Nossos Clientes</h2>
          <p className="text-green-100 max-w-2xl mx-auto">
            A satisfação dos nossos clientes é a nossa maior garantia de qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-green-800 p-8 rounded-2xl relative">
              <Quote className="absolute top-4 right-4 text-green-600 w-12 h-12 opacity-50" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-green-50 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-green-300 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
