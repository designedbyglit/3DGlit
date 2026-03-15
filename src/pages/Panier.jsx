import { useCart } from '@/components/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Panier() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', moto_model: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await base44.entities.Order.create({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: form.address,
      compatible_model: form.moto_model,
      order_type: 'achat',
      total_amount: cartTotal,
      items: cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        chosen_colors: item.chosenColors,
        notes: item.screenshot ? '[Capture configuration jointe]' : '',
      })),
    });

    clearCart();
    toast.success('Commande confirmée ! Nous vous contacterons sous 24h.');
    navigate('/Home');
    setSubmitting(false);
  };

  if (cart.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
      <p className="text-gray-500 mb-6">Découvrez nos pièces 3D personnalisables</p>
      <Link to="/Catalogue" className="inline-flex items-center gap-2 bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
        Voir le catalogue <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {step === 'cart' ? 'Mon panier' : 'Finaliser la commande'}
      </h1>

      {step === 'cart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">⚙️</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.product.name}</p>
                  {Object.keys(item.chosenColors).length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {Object.values(item.chosenColors).map((color, ci) => (
                        <div key={ci} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  )}
                  {item.screenshot && (
                    <img src={item.screenshot} alt="Configuration" className="mt-2 w-24 h-16 object-contain rounded border border-gray-100" />
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(i, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-50 text-sm font-bold">−</button>
                      <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(i, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-50 text-sm font-bold">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-bold text-gray-900">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  <button onClick={() => removeFromCart(i)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-gray-900 mb-4">Récapitulatif</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-medium">{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-orange-500 font-medium">Calculée à l'étape suivante</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
            </div>
            <button
              onClick={() => setStep('checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Commander
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleOrder} className="max-w-xl space-y-5">
          {[
            { key: 'name', label: 'Nom complet *', placeholder: 'Jean Dupont', required: true },
            { key: 'email', label: 'Email *', placeholder: 'jean@email.com', required: true, type: 'email' },
            { key: 'phone', label: 'Téléphone', placeholder: '06 00 00 00 00' },
            { key: 'moto_model', label: 'Modèle de moto', placeholder: 'Derbi Senda, MBK Nitro...' },
            { key: 'address', label: 'Adresse de livraison *', placeholder: '1 rue de la Moto, 75000 Paris', required: true },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                required={field.required}
                type={field.type || 'text'}
                value={form[field.key]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          ))}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep('cart')} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Retour
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {submitting ? 'Envoi...' : 'Confirmer la commande'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
