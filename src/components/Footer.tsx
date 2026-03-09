import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Footer() {
  const navigate = useNavigate();
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const docRef = doc(db, 'companyInfo', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching company info: ", error);
      }
    };

    fetchInfo();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            {info?.logoUrl ? (
              <img src={info.logoUrl} alt={info?.logoText || 'Logo'} className="h-24 object-contain mb-4" />
            ) : (
              <h3 className="text-4xl font-bold text-white mb-4">
                {info?.logoText || 'EVOLUTION'}
              </h3>
            )}
            <p className="text-gray-400 mb-4">
              {info?.description || 'Especialistas em controle de pragas urbanas, oferecendo segurança e qualidade para sua casa ou empresa.'}
            </p>
            <div className="flex gap-4">
              {info?.facebook && (
                <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors"><Facebook /></a>
              )}
              {info?.instagram && (
                <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors"><Instagram /></a>
              )}
              {info?.whatsapp && (
                <a href={`https://wa.me/${info.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors"><MessageCircle /></a>
              )}
              {!info?.facebook && !info?.instagram && !info?.whatsapp && (
                <>
                  <a href="#" className="hover:text-purple-500 transition-colors"><Facebook /></a>
                  <a href="#" className="hover:text-purple-500 transition-colors"><Instagram /></a>
                  <a href="#" className="hover:text-purple-500 transition-colors"><MessageCircle /></a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-500 transition-colors">Início</a></li>
              <li><a href="#servicos" className="hover:text-purple-500 transition-colors">Serviços</a></li>
              <li><a href="#depoimentos" className="hover:text-purple-500 transition-colors">Depoimentos</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-500 transition-colors">Dedetização</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Desratização</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Descupinização</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Limpeza de Caixa d'Água</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-500 shrink-0 mt-1" />
                <span>{info?.address || 'Rua Exemplo, 123 - Bairro, Cidade - UF'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-500 shrink-0" />
                <span>{info?.phone || '(11) 99999-9999'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-500 shrink-0" />
                <span>{info?.email || 'contato@evolutionpragas.com.br'}</span>
              </li>
              {info?.businessHours && (
                <li className="flex items-start gap-3 pt-2 border-t border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-white font-medium mb-1">Horário de Atendimento</span>
                    <span className="text-sm">{info.businessHours}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {info?.logoText || 'Evolution'} Controle de Pragas. Todos os direitos reservados.</p>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 hover:text-purple-500 transition-colors"
          >
            <Lock size={14} />
            Área Administrativa
          </button>
        </div>
      </div>
    </footer>
  );
}
