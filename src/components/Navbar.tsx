import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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
        console.error("Error fetching info: ", error);
      }
    };

    fetchInfo();
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {info?.logoUrl ? (
              <img src={info.logoUrl} alt={info?.logoText || 'Logo'} className="h-12 object-contain" />
            ) : (
              <>
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {info?.logoText ? info.logoText.charAt(0) : 'E'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 leading-none">
                    {info?.logoText || 'EVOLUTION'}
                  </span>
                  <span className="text-xs text-gray-500 font-medium tracking-wider">
                    {info?.logoSubtext || 'CONTROLE DE PRAGAS'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Início</a>
            <a href="#servicos" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Serviços</a>
            <a href="#atendimento" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Atendimento</a>
            <a href="#depoimentos" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Depoimentos</a>
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Sobre</a>
            <button 
              onClick={() => {
                const phone = info?.whatsapp || '5511999999999';
                window.open(`https://wa.me/${phone}?text=Olá! Gostaria de saber mais sobre os serviços.`, '_blank');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <Phone size={18} />
              Fale Conosco
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-600 hover:text-green-600 font-medium px-2" onClick={() => setIsOpen(false)}>Início</a>
              <a href="#servicos" className="text-gray-600 hover:text-green-600 font-medium px-2" onClick={() => setIsOpen(false)}>Serviços</a>
              <a href="#atendimento" className="text-gray-600 hover:text-green-600 font-medium px-2" onClick={() => setIsOpen(false)}>Atendimento</a>
              <a href="#depoimentos" className="text-gray-600 hover:text-green-600 font-medium px-2" onClick={() => setIsOpen(false)}>Depoimentos</a>
              <a href="#" className="text-gray-600 hover:text-green-600 font-medium px-2" onClick={() => setIsOpen(false)}>Sobre</a>
              <button 
                onClick={() => {
                  const phone = info?.whatsapp || '5511999999999';
                  window.open(`https://wa.me/${phone}?text=Olá! Gostaria de saber mais sobre os serviços.`, '_blank');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-full font-medium w-full flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Fale Conosco
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
