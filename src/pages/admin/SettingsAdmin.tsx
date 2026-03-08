import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    description: '',
    logoText: 'EVOLUTION',
    logoSubtext: 'CONTROLE DE PRAGAS',
    logoUrl: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    businessHours: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'companyInfo', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      console.error("Error fetching settings: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'companyInfo', 'main'), formData);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error("Error saving settings: ", error);
      alert('Erro ao salvar configurações.');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Site</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Identidade Visual</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo do Site</label>
            <ImageUpload 
              currentImage={formData.logoUrl}
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
              folder="settings"
            />
            <p className="text-xs text-gray-500 mt-1">Recomendado: Imagem PNG com fundo transparente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto da Logo (Principal)</label>
              <input
                type="text"
                value={formData.logoText}
                onChange={(e) => setFormData({...formData, logoText: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtexto da Logo</label>
              <input
                type="text"
                value={formData.logoSubtext}
                onChange={(e) => setFormData({...formData, logoSubtext: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Informações de Contato</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Link)</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="5511999999999"
              />
              <p className="text-xs text-gray-500 mt-1">Apenas números, com código do país (ex: 5511999999999)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="contato@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Rua, Número - Bairro, Cidade - UF"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horários de Atendimento</label>
            <input
              type="text"
              value={formData.businessHours}
              onChange={(e) => setFormData({...formData, businessHours: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Seg a Sex: 08h às 18h | Sáb: 08h às 12h"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Redes Sociais e Rodapé</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (URL)</label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="https://instagram.com/suaempresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook (URL)</label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="https://facebook.com/suaempresa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Empresa (Rodapé)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              rows={3}
              placeholder="Breve descrição sobre a empresa..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Salvar Configurações
        </button>
      </form>
    </div>
  );
}
