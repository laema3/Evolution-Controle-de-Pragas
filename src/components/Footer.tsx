import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">EVOLUTION</h3>
            <p className="text-gray-400 mb-4">
              Especialistas em controle de pragas urbanas, oferecendo segurança e qualidade para sua casa ou empresa.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-green-500 transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-green-500 transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-green-500 transition-colors"><MessageCircle /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-500 transition-colors">Início</a></li>
              <li><a href="#servicos" className="hover:text-green-500 transition-colors">Serviços</a></li>
              <li><a href="#depoimentos" className="hover:text-green-500 transition-colors">Depoimentos</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-500 transition-colors">Dedetização</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Desratização</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Descupinização</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Limpeza de Caixa d'Água</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                <span>Rua Exemplo, 123 - Bairro<br />Cidade - UF, 00000-000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500 shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500 shrink-0" />
                <span>contato@evolutionpragas.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Evolution Controle de Pragas. Todos os direitos reservados.</p>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 hover:text-green-500 transition-colors"
          >
            <Lock size={14} />
            Área Administrativa
          </button>
        </div>
      </div>
    </footer>
  );
}
