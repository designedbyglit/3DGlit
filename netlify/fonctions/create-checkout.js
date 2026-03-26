const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items, customer, shipping } = JSON.parse(event.body);

    /* Produits */
    const line_items = items
      .filter(item => item.price > 0)
      .map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.colors && item.colors.length
              ? 'Variante : ' + (item.variant || '') + ' | Couleurs : ' + item.colors.map(c => `${c.label} (${c.hex})`).join(', ')
              : (item.variant ? 'Variante : ' + item.variant : 'Pièce moto imprimée 3D'),
            metadata: { product_id: item.id, colors: JSON.stringify(item.colors || []) },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      }));

    /* Frais de port */
    if (shipping && shipping.cost > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Frais de livraison' },
          unit_amount: Math.round(shipping.cost * 100),
        },
        quantity: 1,
      });
    }

    if (line_items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Panier vide' }) };
    }

    const orderSummary = items.map(i =>
      `${i.name}${i.variant ? ' [' + i.variant + ']' : ''} ×${i.qty}` +
      (i.colors.length ? ' | ' + i.colors.map(c => `${c.label}:${c.hex}`).join(', ') : '')
    ).join(' /// ');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email: customer.email,
      metadata: {
        nom:       `${customer.prenom} ${customer.nom}`,
        telephone: customer.telephone || '',
        adresse:   `${customer.adresse}, ${customer.cp} ${customer.ville}, ${customer.pays}`,
        message:   customer.message || '',
        commande:  orderSummary.substring(0, 500),
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      success_url: process.env.URL + '/success.html',
      cancel_url:  process.env.URL + '/#/panier',
      locale: 'fr',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
