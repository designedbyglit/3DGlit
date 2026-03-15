import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Shield, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProductCard from '@/components/ProductCard';

const FEATURES = [
  { icon: Zap, title: 'Impression 3D haute qualité', desc: 'Pièces fabriquées avec des filaments premium résistants aux chocs et à la chaleur.' },
  { icon: Shield, title: 'Compatibilité garantie', desc: 'Chaque pièce est conçue et testée pour les motos 50cc (Derbi, MBK, Yamaha, Peugeot…).' },
  { icon: Star, title: 'Personnalisation totale', desc: 'Choisissez vos couleurs grâce à notre configurateur 3D interactif.' },
  { icon: Truck, title: 'Livraison rapide', desc: 'Expédition sous 5 à 10 jours ouvrés après validation de votre commande.' },
];

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => base44.entities.Product.filter({ featured: true }, '-created_date', 4),
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-28 lg:py-40 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full uppercase tracking-widest mb-4">
              Pièces 3D sur-mesure
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
              Personnalisez votre<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                moto 50cc
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Des pièces uniques, imprimées en 3D et personnalisées à vos couleurs. Cache allumage, pipe performance, bouchon de cadre… faites la différence sur la route.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/Catalogue"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Voir le catalogue <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/Configurateur"
                className="inline-flex items-center gap-2 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Configurateur 3D
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              <img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80"
                alt="Moto 50cc"
                className="w-full h-full object-cover rounded-2xl opacity-80"
              />
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white rounded-xl px-4 py-2 font-bold shadow-lg">
                À partir de 12€
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Pièces populaires</h2>
            <Link to="/Catalogue" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Besoin d'une pièce sur-mesure ?</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Vous avez un projet spécifique ? Contactez-nous pour un devis personnalisé gratuit.
          </p>
          <Link
            to="/Contact"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors"
          >
            Demander un devis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
