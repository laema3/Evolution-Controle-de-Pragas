import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Trash2, Edit, Plus, X, Save } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

export default function CarouselAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'carousel'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by order
      data.sort((a: any, b: any) => a.order - b.order);
      setItems(data);
    } catch (error) {
      console.error("Error fetching carousel items: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'carousel', editingId), formData);
      } else {
        await addDoc(collection(db, 'carousel'), formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', subtitle: '', image: '', order: 0 });
      fetchItems();
    } catch (error) {
      console.error("Error saving carousel item: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteDoc(doc(db, 'carousel', id));
        fetchItems();
      } catch (error) {
        console.error("Error deleting carousel item: ", error);
      }
    }
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      order: item.order
    });
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({ title: '', subtitle: '', image: '', order: items.length + 1 });
    setIsModalOpen(true);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Carrossel</h1>
        <button 
          onClick={openNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Novo Item
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="h-48 md:w-64 md:h-auto shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">Ordem: {item.order}</span>
              </div>
              <p className="text-gray-600 mb-4">{item.subtitle}</p>
              <div className="flex justify-end gap-2 mt-auto">
                <button 
                  onClick={() => openEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Editar Item' : 'Novo Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
              
              <ImageUpload 
                currentImage={formData.image}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                folder="carousel"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de Exibição</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
