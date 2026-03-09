import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Trash2, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

export default function QuotesAdmin() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuotes(data);
    } catch (error) {
      console.error("Error fetching quotes: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'quoteRequests', id), { status: newStatus });
      fetchQuotes();
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await deleteDoc(doc(db, 'quoteRequests', id));
        fetchQuotes();
        if (selectedQuote && selectedQuote.id === id) {
          setSelectedQuote(null);
        }
      } catch (error) {
        console.error("Error deleting quote: ", error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> Novo</span>;
      case 'contacted':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Contatado</span>;
      case 'closed':
        return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Fechado</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">Desconhecido</span>;
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Solicitações de Orçamento</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500">Data</th>
              <th className="px-6 py-4 font-medium text-gray-500">Cliente</th>
              <th className="px-6 py-4 font-medium text-gray-500">Serviço</th>
              <th className="px-6 py-4 font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium">{quote.name}</td>
                <td className="px-6 py-4">{quote.service}</td>
                <td className="px-6 py-4">{getStatusBadge(quote.status)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedQuote(quote)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Ver Detalhes"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(quote.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Detalhes do Orçamento</h2>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{selectedQuote.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{new Date(selectedQuote.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{selectedQuote.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedQuote.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Serviço Solicitado</p>
                <p className="font-medium">{selectedQuote.service}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Endereço</p>
                <p className="font-medium">{selectedQuote.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Mensagem</p>
                <p className="bg-gray-50 p-3 rounded-lg text-sm mt-1">{selectedQuote.message}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-2">Alterar Status</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusChange(selectedQuote.id, 'new')}
                  className={`px-3 py-1 rounded-full text-sm border ${selectedQuote.status === 'new' ? 'bg-blue-100 border-blue-200 text-blue-800' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  Novo
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedQuote.id, 'contacted')}
                  className={`px-3 py-1 rounded-full text-sm border ${selectedQuote.status === 'contacted' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  Contatado
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedQuote.id, 'closed')}
                  className={`px-3 py-1 rounded-full text-sm border ${selectedQuote.status === 'closed' ? 'bg-purple-100 border-purple-200 text-purple-800' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  Fechado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
