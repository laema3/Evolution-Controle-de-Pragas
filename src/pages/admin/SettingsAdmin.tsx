import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save } from 'lucide-react';

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    description: '',
    logoText: 'EVOLUTION',
    logoSubtext: 'CONTROLE DE PRAGAS'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'companyInfo', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as any);
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
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Informações de Contato</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="(11) 99999-9999"
            />
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
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Identidade Visual e Rodapé</h2>
          
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
