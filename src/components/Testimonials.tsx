import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (data.length > 0) {
          setTestimonials(data);
        } else {
          // Fallback
          setTestimonials([
            {
              id: '1',
              name: 'Carlos Silva',
              role: 'Gerente de Condomínio',
              content: 'A Evolution Controle de Pragas transformou nosso condomínio. O atendimento foi rápido e o problema com formigas foi resolvido definitivamente.',
              rating: 5
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching testimonials: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 bg-purple-600 text-white" id="depoimentos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Dizem Nossos Clientes</h2>
          <p className="text-purple-100 max-w-2xl mx-auto">
            A satisfação dos nossos clientes é a nossa maior garantia de qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-purple-700 p-8 rounded-2xl relative">
              <Quote className="absolute top-4 right-4 text-purple-400 w-12 h-12 opacity-30" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-purple-50 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-purple-300 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
