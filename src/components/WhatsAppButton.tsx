import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function WhatsAppButton() {
  const [phoneNumber, setPhoneNumber] = useState('5511999999999'); // Fallback number
  const message = 'Olá! Gostaria de saber mais sobre os serviços da Evolution.';

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const docRef = doc(db, 'companyInfo', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().whatsapp) {
          setPhoneNumber(docSnap.data().whatsapp);
        }
      } catch (error) {
        console.error("Error fetching company info: ", error);
      }
    };

    fetchInfo();
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 left-4 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50 flex items-center justify-center group"
    >
      <MessageCircle className="w-6 h-6" /> {/* Using MessageCircle as generic chat icon, could be custom SVG for WA */}
      <span className="absolute left-full ml-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        WhatsApp
      </span>
    </button>
  );
}
