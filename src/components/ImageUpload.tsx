import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  folder: string;
}

export default function ImageUpload({ currentImage, onImageUploaded, folder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      onImageUploaded(downloadURL);
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Erro ao fazer upload da imagem.");
      setPreview(currentImage || null); // Revert preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Imagem</label>
      
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remover imagem"
              >
                <X size={16} />
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors text-gray-400 hover:text-green-600"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload size={24} className="mb-2" />
                <span className="text-xs font-medium">Upload</span>
              </>
            )}
          </div>
        )}

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500">
            Clique na área tracejada para selecionar uma imagem.
            <br />
            Formatos aceitos: JPG, PNG, WEBP.
          </p>
        </div>
      </div>
    </div>
  );
}
