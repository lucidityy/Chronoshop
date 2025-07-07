// Système de partage des commandes entre les endpoints
// Utilise une base de données externe ou un système de cache en production

// Simulation d'une base de données externe avec des calls HTTP
export async function saveOrder(orderData) {
  // En production, utilisez une vraie base de données (MongoDB, PostgreSQL, etc.)
  console.log('Commande sauvegardée:', orderData.orderRef);
  return {
    success: true,
    orderRef: orderData.orderRef,
    timestamp: new Date().toISOString()
  };
}

export async function getOrder(orderRef, webhookUrl) {
  // Essayer de récupérer depuis l'API orders
  try {
    const response = await fetch(`${webhookUrl}/api/orders?ref=${orderRef}`);
    if (response.ok) {
      const data = await response.json();
      return data.order || null;
    }
  } catch (error) {
    console.error('Erreur récupération commande:', error);
  }
  return null;
}

export default async function handler(req, res) {
  // Endpoint pour récupérer les commandes partagées
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { ref } = req.query;
    
    if (!ref) {
      return res.status(400).json({ error: 'Référence manquante' });
    }

    // Simulation - en production, récupérer depuis une vraie DB
    return res.status(200).json({
      status: 'OK',
      message: 'Endpoint de partage fonctionnel',
      ref: ref
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 