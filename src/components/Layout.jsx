import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  const navLinks = [
    { label: 'Accueil', path: '/Home' },
    { label: 'Catalogue', path: '/Catalogue' },
    { label: 'Configurateur', path: '/Configurateur' },
    { label: 'À propos', path: '/About' },
    { label: 'Contact', path: '/Contact' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/Home" className="flex items-center gap-2">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b6d2888ebab2baf22df996/22fd0e775_logo.png" alt="3DGlit" className="h-10 w-auto" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">3DGlit</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-orange-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Cart + mobile menu */}
            <div className="flex items-center gap-4">
              <Link to="/Panier" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium py-2 ${
                  location.pathname === link.path ? 'text-orange-500' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <div className="pt-16">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b6d2888ebab2baf22df996/22fd0e775_logo.png" alt="3DGlit" className="h-8 w-auto" />
              <span className="font-bold text-white">3DGlit</span>
            </div>
            <p className="text-sm leading-relaxed">Pièces moto 50cc imprimées en 3D, personnalisées à vos couleurs. Qualité artisanale, livraison rapide.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Navigation</h4>
            <div className="space-y-2 text-sm">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} className="block hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
            <div className="space-y-1 text-sm">
              <p>contact@3dglit.fr</p>
              <p>Commandes & devis personnalisés</p>
              <p>Délai : 5 à 10 jours ouvrés</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-600">
          © 2026 3DGlit — Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
