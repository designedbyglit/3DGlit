import { Link } from 'react-router-dom';
import { Palette, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gray-50 h-48">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⚙️</span>
            </div>
          </div>
        )}
        {product.customizable && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
            <Palette className="w-3 h-3" /> Perso
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-full">Rupture de stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">{product.category}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        {product.compatible_models && (
          <p className="text-xs text-gray-400 mb-2 line-clamp-1">{product.compatible_models}</p>
        )}

        {/* Color swatches */}
        {product.available_colors?.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.available_colors.slice(0, 6).map(color => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.available_colors.length > 6 && (
              <span className="text-xs text-gray-400 self-center">+{product.available_colors.length - 6}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{product.price?.toFixed(2)} €</span>
          <Link
            to={`/Produit/${product.id}`}
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-orange-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Configurer
          </Link>
        </div>
      </div>
    </div>
  );
}
