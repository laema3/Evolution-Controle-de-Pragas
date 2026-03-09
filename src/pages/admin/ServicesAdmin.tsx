import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Trash2, Edit, Plus, X, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import { GoogleGenAI } from "@google/genai";

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    icon: 'Bug'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), formData);
      } else {
        await addDoc(collection(db, 'services'), formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', description: '', image: '', icon: 'Bug' });
      fetchServices();
    } catch (error) {
      console.error("Error saving service: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
        fetchServices();
      } catch (error) {
        console.error("Error deleting service: ", error);
      }
    }
  };

  const generateDescription = async () => {
    if (!formData.title) {
      alert('Por favor, preencha o título do serviço primeiro.');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      alert('Erro de configuração: Chave da API Gemini não encontrada. Entre em contato com o suporte.');
      console.error("GEMINI_API_KEY is missing");
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-3-flash-preview';
      
      const prompt = `Escreva uma descrição curta, profissional e persuasiva (máximo de 3 linhas) para um serviço de controle de pragas chamado "${formData.title}". A descrição deve ser em português do Brasil e focada em marketing para atrair clientes.`;
      
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, description: response.text || '' }));
      }
    } catch (error) {
      console.error("Error generating description: ", error);
      alert('Erro ao gerar descrição com IA. Tente novamente mais tarde.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openEdit = (service: any) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      image: service.image,
      icon: service.icon || 'Bug'
    });
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', image: '', icon: 'Bug' });
    setIsModalOpen(true);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Serviços</h1>
        <button 
          onClick={openNew}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500 font-bold shadow-sm"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
              {service.image ? (
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-400" size={32} />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => openEdit(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
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
              <h2 className="text-xl font-bold">{editingId ? 'Editar Serviço' : 'Novo Serviço'}</h2>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                  placeholder="Ex: Dedetização de Baratas"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={isGenerating || !formData.title}
                    className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={14} />
                    {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                  </button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  rows={3}
                  required
                  placeholder="Descrição do serviço..."
                />
              </div>
              
              <ImageUpload 
                currentImage={formData.image}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                folder="services"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ícone (Nome do Lucide Icon)</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="Bug">Bug (Inseto)</option>
                  <option value="Rat">Rat (Rato)</option>
                  <option value="ShieldAlert">ShieldAlert (Escudo)</option>
                  <option value="Droplets">Droplets (Gotas)</option>
                  <option value="SprayCan">SprayCan (Spray)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-500 flex items-center justify-center gap-2 shadow-lg"
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
