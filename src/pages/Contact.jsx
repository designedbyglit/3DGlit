import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Send, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const location = useLocation();
  const preFilledProduct = location.state?.product;
  const preFilledColors = location.state?.chosenColors;
  const preFilledScreenshot = location.state?.screenshot;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    moto_model: '',
    message: preFilledProduct
      ? `Je souhaite un devis pour : ${preFilledProduct.name}${
          preFilledColors && Object.keys(preFilledColors).length > 0
            ? `\nCouleurs choisies : ${Object.entries(preFilledColors).map(([p, c]) => `${p}: ${c}`).join(', ')}`
            : ''
        }`
      : '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await base44.entities.Order.create({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      order_type: 'devis',
      compatible_model: form.moto_model,
      notes: form.message,
      items: preFilledProduct ? [{
        product_id: preFilledProduct.id,
        product_name: preFilledProduct.name,
        chosen_colors: preFilledColors || {},
        quantity: 1,
        unit_price: preFilledProduct.price,
        notes: preFilledScreenshot ? `[Capture configuration jointe]` : '',
      }] : [],
      notes: form.message + (preFilledScreenshot ? `\n\n[Capture de la configuration incluse]` : ''),
    });

    await base44.integrations.Core.SendEmail({
      to: 'contact@moto3dparts.fr',
      subject: `Nouvelle demande de devis — ${form.name}`,
      body: `
Nom : ${form.name}
Email : ${form.email}
Téléphone : ${form.phone || 'non renseigné'}
Modèle de moto : ${form.moto_model || 'non renseigné'}

Message :
${form.message}
      `,
    });

    setSubmitted(true);
    setSubmitting(false);
    toast.success('Votre demande a bien été envoyée !');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Contact & Devis</h1>
        <p className="text-gray-500">Un projet sur-mesure ? Une question ? Répondons sous 24h.</p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée !</h2>
          <p className="text-gray-600">Nous vous répondrons dans les 24 heures. Merci pour votre confiance.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          {preFilledProduct && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-sm font-semibold text-orange-700">Demande de devis pour :</p>
              <p className="text-orange-800 font-bold">{preFilledProduct.name}</p>
              {preFilledColors && Object.keys(preFilledColors).length > 0 && (
                <div className="flex gap-1 mt-2">
                  {Object.values(preFilledColors).map((color, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white shadow" style={{ backgroundColor: color }} />
                  ))}
                </div>
              )}
              {preFilledScreenshot && (
                <div className="mt-3">
                  <p className="text-xs text-orange-600 font-medium mb-1">Capture de votre configuration :</p>
                  <img src={preFilledScreenshot} alt="Configuration" className="rounded-lg border border-orange-200 max-h-40 object-contain" />
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="jean@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="06 00 00 00 00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle de moto</label>
                <input
                  value={form.moto_model}
                  onChange={e => setForm({...form, moto_model: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Ex: Derbi Senda, MBK Nitro..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message / Description du projet *</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                placeholder="Décrivez votre projet, les pièces souhaitées, les couleurs..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Envoi en cours…</>
              ) : (
                <><Send className="w-4 h-4" /> Envoyer ma demande</>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
