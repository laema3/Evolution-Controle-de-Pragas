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
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {info?.logoUrl ? (
              <img src={info.logoUrl} alt={info?.logoText || 'Logo'} className="h-24 object-contain" />
            ) : (
              <>
                <div className="w-20 h-20 bg-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">
                    {info?.logoText ? info.logoText.charAt(0) : 'E'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900 leading-none">
                    {info?.logoText || 'EVOLUTION'}
                  </span>
                  <span className="text-sm text-gray-500 font-medium tracking-wider">
                    {info?.logoSubtext || 'CONTROLE DE PRAGAS'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {[
              { label: 'Início', href: '#' },
              { label: 'Serviços', href: '#servicos' },
              { label: 'Atendimento', href: '#atendimento' },
              { label: 'Depoimentos', href: '#depoimentos' },
              { label: 'Sobre', href: '#' },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="relative group h-full flex items-center text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                {/* Yellow Square Indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.label}
              </a>
            ))}
            <button 
              onClick={() => {
                const phone = info?.whatsapp || '+5534991963030';
                window.open(`https://wa.me/${phone}?text=Olá! Gostaria de saber mais sobre os serviços.`, '_blank');
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2 shadow-sm"
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
              {[
                { label: 'Início', href: '#' },
                { label: 'Serviços', href: '#servicos' },
                { label: 'Atendimento', href: '#atendimento' },
                { label: 'Depoimentos', href: '#depoimentos' },
                { label: 'Sobre', href: '#' },
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="relative group text-gray-600 hover:text-purple-600 font-medium px-2 py-2 flex items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-3 h-3 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </a>
              ))}
              <button 
                onClick={() => {
                  const phone = info?.whatsapp || '+5534991963030';
                  window.open(`https://wa.me/${phone}?text=Olá! Gostaria de saber mais sobre os serviços.`, '_blank');
                }}
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold w-full flex items-center justify-center gap-2 shadow-sm"
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
