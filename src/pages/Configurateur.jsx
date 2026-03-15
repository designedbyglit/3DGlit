import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ColorConfigurator from '@/components/ColorConfigurator';
import { useCart } from '@/components/CartContext';
import { ShoppingCart, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRef } from 'react';

export default function Configurateur() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 50),
  });

  const [selectedId, setSelectedId] = useState(null);
  const [chosenColors, setChosenColors] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const configuratorRef = useRef(null);

  const selectedProduct = products.find(p => p.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setChosenColors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Configurateur 3D</h1>
        <p className="text-gray-500">Sélectionnez une pièce et personnalisez ses couleurs librement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product list */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Choisissez une pièce</h2>
          <div className="space-y-2">
            {products.filter(p => p.customizable !== false).map(p => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                  selectedId === p.id
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">⚙️</div>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${selectedId === p.id ? 'text-orange-600' : 'text-gray-900'}`}>{p.name}</p>
                  <p className="text-xs text-gray-400">{p.price?.toFixed(2)} €</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Configurator */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <span className="text-2xl font-extrabold text-orange-500">{selectedProduct.price?.toFixed(2)} €</span>
              </div>
              <ColorConfigurator
                ref={configuratorRef}
                product={selectedProduct}
                chosenColors={chosenColors}
                onColorChange={setChosenColors}
              />
              <div className="flex gap-3 mt-6">
                {(selectedProduct.order_type === 'panier' || selectedProduct.order_type === 'les deux') && selectedProduct.in_stock && (
                  <button
                    onClick={async () => {
                      const screenshot = await configuratorRef.current?.captureScreenshot();
                      addToCart(selectedProduct, 1, chosenColors, screenshot);
                      toast.success(`${selectedProduct.name} ajouté au panier !`);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                  </button>
                )}
                {(selectedProduct.order_type === 'devis' || selectedProduct.order_type === 'les deux') && (
                  <button
                    onClick={async () => {
                      const screenshot = await configuratorRef.current?.captureScreenshot();
                      navigate('/Contact', { state: { product: selectedProduct, chosenColors, screenshot } });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all"
                  >
                    <FileText className="w-4 h-4" /> Demander un devis
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl h-full min-h-80 flex flex-col items-center justify-center text-gray-400 p-8">
              <span className="text-6xl mb-4">🎨</span>
              <p className="text-lg font-medium text-gray-500">Sélectionnez une pièce</p>
              <p className="text-sm">pour commencer la personnalisation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
