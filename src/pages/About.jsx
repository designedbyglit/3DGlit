export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full uppercase tracking-widest mb-4">
          Notre histoire
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Passionnés de moto 50cc</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Nous créons des pièces uniques, imprimées en 3D, pour que votre moto ressemble à ce que vous avez en tête.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=600&q=80"
            alt="Impression 3D"
            className="rounded-2xl w-full object-cover h-64"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre démarche</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Chaque pièce est conçue en CAO, testée sur différents modèles de 50cc, puis imprimée à la demande avec des filaments de qualité industrielle (PETG, ASA, PLA+).
          </p>
          <p className="text-gray-600 leading-relaxed">
            Fini les pièces d'origine fades et identiques à tout le monde. Avec notre configurateur, vous choisissez vos couleurs et recevez une pièce unique, faite pour vous.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          { value: '8+', label: 'Pièces disponibles', desc: 'Du cache allumage à la pipe d\'admission' },
          { value: '100%', label: 'Personnalisable', desc: 'Choisissez vos couleurs avec le configurateur' },
          { value: '5-10j', label: 'Délai de livraison', desc: 'Fabrication à la commande, qualité garantie' },
        ].map(stat => (
          <div key={stat.value} className="bg-gray-50 rounded-2xl p-6">
            <div className="text-4xl font-extrabold text-orange-500 mb-1">{stat.value}</div>
            <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
            <div className="text-sm text-gray-500">{stat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
