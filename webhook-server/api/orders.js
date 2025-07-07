// Endpoint pour recevoir les nouvelles commandes
// Base de données simple des commandes (partagée avec webhook.js)
let orders = {};

// Fonction pour ajouter une commande
function addOrder(orderData) {
  const orderEntry = {
    ref: orderData.orderRef,
    client: orderData.telegram,
    email: orderData.email,
    phone: orderData.phone,
    items: orderData.items,
    total: orderData.total,
    delivery: orderData.deliveryType === 'home' 
      ? `Domicile - ${orderData.address}` 
      : 'Sur place',
    estimate: orderData.deliveryType === 'home' ? '24-48h' : '2-4h',
    date: new Date().toLocaleString('fr-FR')
  };

  orders[orderData.orderRef] = orderEntry;
  console.log(`Commande ajoutée: ${orderData.orderRef}`);
  
  return orderEntry;
}

export default async function handler(req, res) {
  // Permettre CORS pour votre app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ajouter un endpoint GET pour tester la connectivité et récupérer les commandes
  if (req.method === 'GET') {
    const { ref } = req.query;
    
    if (ref) {
      // Récupérer une commande spécifique
      const order = orders[ref];
      if (order) {
        return res.status(200).json({
          success: true,
          order: order,
          found: true
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée',
          ref: ref
        });
      }
    } else {
      // Test de connectivité
      return res.status(200).json({ 
        status: 'OK', 
        message: 'Endpoint orders fonctionnel',
        timestamp: new Date().toISOString(),
        orderCount: Object.keys(orders).length
      });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      method: req.method,
      allowed: ['GET', 'POST', 'OPTIONS']
    });
  }

  try {
    const orderData = req.body;
    
    // Validation des données
    if (!orderData.orderRef || !orderData.phone || !orderData.items) {
      return res.status(400).json({ error: 'Données de commande manquantes' });
    }

    // Ajouter la commande au système
    const order = await addOrder(orderData);
    
    console.log(`Nouvelle commande reçue: ${orderData.orderRef}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Commande enregistrée avec succès',
      orderRef: orderData.orderRef
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la commande:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
} 