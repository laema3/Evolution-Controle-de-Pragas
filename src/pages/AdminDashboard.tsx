import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Bug, 
  MapPin, 
  Image, 
  MessageSquare, 
  FileText 
} from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const isActive = (path: string) => location.pathname === path || (path === '/admin' && location.pathname === '/admin');

  const navItems = [
    { path: '/admin/quotes', icon: <FileText size={20} />, label: 'Orçamentos' },
    { path: '/admin/services', icon: <Bug size={20} />, label: 'Serviços' },
    { path: '/admin/cities', icon: <MapPin size={20} />, label: 'Cidades' },
    { path: '/admin/carousel', icon: <Image size={20} />, label: 'Carrossel' },
    { path: '/admin/testimonials', icon: <MessageSquare size={20} />, label: 'Depoimentos' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="mb-4 px-4">
            <p className="text-sm text-gray-500">Logado como:</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium w-full transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
