import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  folder: string;
}

export default function ImageUpload({ currentImage, onImageUploaded, folder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState(firebaseConfig.storageBucket);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentImage || null);
    setUploadError(null);
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("O arquivo é muito grande. O tamanho máximo é 5MB.");
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploadError(null);

    setIsUploading(true);
    try {
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      let bucket = bucketName;
      
      // Get auth token
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      const token = await user.getIdToken();

      // Upload via proxy to bypass CORS
      // POST /firebase-storage/v0/b/[bucket]/o?name=[path]
      let url = `/firebase-storage/v0/b/${bucket}/o?name=${encodeURIComponent(fileName)}`;
      
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': file.type
        },
        body: file
      });

      // If 404, try the alternative bucket domain (appspot.com)
      if (response.status === 404 && bucket.includes('firebasestorage.app')) {
        console.warn(`Bucket ${bucket} not found, trying appspot.com fallback...`);
        bucket = bucket.replace('firebasestorage.app', 'appspot.com');
        url = `/firebase-storage/v0/b/${bucket}/o?name=${encodeURIComponent(fileName)}`;
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': file.type
          },
          body: file
        });
      }
      
      // If still 404, try just the project ID (sometimes bucket name is just project ID)
      if (response.status === 404) {
        console.warn(`Bucket ${bucket} not found, trying project ID fallback...`);
        bucket = firebaseConfig.projectId;
        url = `/firebase-storage/v0/b/${bucket}/o?name=${encodeURIComponent(fileName)}`;
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': file.type
          },
          body: file
        });
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Firebase Storage not enabled. Falling back to base64 compression.");
          // Fallback to base64 if storage is not enabled
          const compressImage = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 800;
                  const MAX_HEIGHT = 800;
                  let width = img.width;
                  let height = img.height;

                  if (width > height) {
                    if (width > MAX_WIDTH) {
                      height *= MAX_WIDTH / width;
                      width = MAX_WIDTH;
                    }
                  } else {
                    if (height > MAX_HEIGHT) {
                      width *= MAX_HEIGHT / height;
                      height = MAX_HEIGHT;
                    }
                  }

                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  
                  // Compress to JPEG with 0.7 quality to keep it small for Firestore
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                  resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
              };
              reader.onerror = (error) => reject(error);
            });
          };
          
          const base64Image = await compressImage(file);
          onImageUploaded(base64Image);
          setIsUploading(false);
          return;
        }
        
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      
      // Get download URL using the SDK (it works for reads if public or if we have token, 
      // but getDownloadURL generates a token-based URL which is safer)
      // Alternatively, we can construct the media link from the response
      // The response contains "downloadTokens".
      // URL format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[name]?alt=media&token=[downloadToken]
      
      const downloadToken = data.downloadTokens;
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
      
      onImageUploaded(downloadURL);
    } catch (error: any) {
      console.error("Error uploading image: ", error);
      
      let errorMessage = "Erro ao fazer upload da imagem. Tente novamente.";
      
      let isStorageError = false;
      if (error.message === "Upload timeout") {
        errorMessage = "O upload demorou muito. Verifique sua conexão ou tente uma imagem menor.";
      } else if (error.message.includes("Usuário não autenticado")) {
        errorMessage = "Você precisa estar logado para fazer upload.";
      } else if (error.message.includes("tamanho máximo")) {
        errorMessage = error.message;
      } else if (error.message.includes("404")) {
        errorMessage = "Bucket de armazenamento não encontrado. Verifique se o Storage está ativado no console do Firebase.";
        setUploadError("storage_not_enabled");
        isStorageError = true;
      }

      if (!isStorageError) {
        alert(errorMessage);
        setPreview(currentImage || null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Imagem</label>
      
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32">
          {preview ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 group">
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
              className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors text-gray-400 hover:text-green-600"
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

          {uploadError === "storage_not_enabled" && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-2 text-center z-20 rounded-lg">
              <p className="text-white text-xs mb-2 font-bold">Erro de Configuração</p>
              <p className="text-gray-300 text-[10px] mb-2">
                O bucket {bucketName} não foi encontrado.
              </p>
              <div className="flex flex-col gap-1 w-full">
                <a 
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/storage`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-700 font-medium"
                >
                  1. Ativar Storage
                </a>
                
                <div className="mt-1">
                  <p className="text-gray-400 text-[9px] mb-1">2. Ou corrija o nome:</p>
                  <div className="flex gap-1">
                    <input 
                      id="bucket-input"
                      type="text" 
                      placeholder="bucket.appspot.com"
                      className="flex-1 px-1 py-0.5 text-[10px] rounded text-black w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = e.currentTarget.value.trim();
                          if (val) {
                            setBucketName(val);
                            setUploadError(null);
                            alert(`Bucket atualizado para: ${val}. Tente o upload novamente.`);
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('bucket-input') as HTMLInputElement;
                        const val = input?.value.trim();
                        if (val) {
                          setBucketName(val);
                          setUploadError(null);
                          alert(`Bucket atualizado para: ${val}. Tente o upload novamente.`);
                        }
                      }}
                      className="px-1 py-0.5 bg-green-600 text-white text-[10px] rounded hover:bg-green-700"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setUploadError(null)}
                className="mt-2 text-gray-500 hover:text-white text-[9px] underline"
              >
                Fechar
              </button>
            </div>
          )}
        </div>

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
