import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ColorConfigurator from '@/components/ColorConfigurator';
import { useState, useRef } from 'react';
import { useCart } from '@/components/CartContext';
import { ShoppingCart, FileText, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Produit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [chosenColors, setChosenColors] = useState({});
  const [added, setAdded] = useState(false);
  const configuratorRef = useRef(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => base44.entities.Product.filter({ id }),
    select: data => Array.isArray(data) ? data[0] : data,
  });

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
      Produit introuvable. <Link to="/Catalogue" className="text-orange-500 underline">Retour catalogue</Link>
    </div>
  );

  const handleAddToCart = async () => {
    const screenshot = await configuratorRef.current?.captureScreenshot();
    addToCart(product, quantity, chosenColors, screenshot);
    setAdded(true);
    toast.success(`${product.name} ajouté au panier !`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDevis = async () => {
    const screenshot = await configuratorRef.current?.captureScreenshot();
    navigate('/Contact', { state: { product, chosenColors, screenshot } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/Catalogue" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Configurator */}
        <div>
          <ColorConfigurator ref={configuratorRef} product={product} chosenColors={chosenColors} onColorChange={setChosenColors} />
        </div>

        {/* Right: Info */}
        <div>
          <span className="text-xs text-orange-500 font-semibold uppercase tracking-widest">{product.category}</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-3">{product.name}</h1>
          {product.compatible_models && (
            <p className="text-sm text-gray-400 mb-4">Compatible : {product.compatible_models}</p>
          )}
          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="text-4xl font-extrabold text-gray-900 mb-6">
            {product.price?.toFixed(2)} €
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantité :</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50 font-bold">−</button>
              <span className="px-4 py-2 text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-50 font-bold">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {(product.order_type === 'panier' || product.order_type === 'les deux') && product.in_stock && (
              <button
                onClick={handleAddToCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all ${
                  added ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {added ? <><Check className="w-4 h-4" /> Ajouté !</> : <><ShoppingCart className="w-4 h-4" /> Ajouter au panier</>}
              </button>
            )}
            {(product.order_type === 'devis' || product.order_type === 'les deux') && (
              <button
                onClick={handleDevis}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                <FileText className="w-4 h-4" /> Demander un devis
              </button>
            )}
          </div>

          {!product.in_stock && (
            <p className="mt-4 text-red-500 text-sm font-medium">⚠️ Ce produit est en rupture de stock. Contactez-nous pour un délai.</p>
          )}

          <div className="mt-8 bg-gray-50 rounded-2xl p-4 text-sm text-gray-500 space-y-1">
            <p>✅ Impression 3D haute résistance</p>
            <p>✅ Délai de fabrication : 5 à 10 jours</p>
            <p>✅ Livraison suivie incluse</p>
          </div>
        </div>
      </div>
    </div>
  );
}
