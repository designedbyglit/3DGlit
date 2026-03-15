import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';
import { Upload, Check, Box } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(null);

  const { data: products = [] } = useQuery({
    queryKey: ['products-admin'],
    queryFn: () => base44.entities.Product.list('-created_date', 50),
  });

  const handleUploadGLB = async (productId, file) => {
    if (!file || !file.name.endsWith('.glb')) {
      toast.error('Veuillez sélectionner un fichier .glb');
      return;
    }
    setUploading(productId);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Product.update(productId, { model_3d_url: file_url });
    queryClient.invalidateQueries({ queryKey: ['products-admin'] });
    toast.success('Modèle 3D uploadé !');
    setUploading(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Admin — Modèles 3D</h1>
        <p className="text-gray-500 text-sm">Uploadez les fichiers .glb pour chaque produit.</p>
      </div>

      <div className="space-y-3">
        {products.map(product => (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">⚙️</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-400">{product.price?.toFixed(2)} €</p>
            </div>

            <div className="flex items-center gap-3">
              {product.model_3d_url ? (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-lg">
                  <Check className="w-4 h-4" /> .glb chargé
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-gray-400 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Box className="w-4 h-4" /> Pas de modèle 3D
                </span>
              )}

              <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                uploading === product.id
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}>
                {uploading === product.id ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Upload…</>
                ) : (
                  <><Upload className="w-4 h-4" /> {product.model_3d_url ? 'Remplacer' : 'Uploader .glb'}</>
                )}
                <input
                  type="file"
                  accept=".glb"
                  className="hidden"
                  disabled={uploading === product.id}
                  onChange={e => handleUploadGLB(product.id, e.target.files[0])}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
