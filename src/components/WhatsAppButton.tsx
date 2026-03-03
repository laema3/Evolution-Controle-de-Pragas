import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '5511999999999'; // Replace with actual number
  const message = 'Olá! Gostaria de saber mais sobre os serviços da Evolution.';

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
