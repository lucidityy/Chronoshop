const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de données simple des commandes
let orders = {};

// Token du bot Telegram
const BOT_TOKEN = '7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA';

// Fonction pour envoyer un message Telegram
async function sendTelegramMessage(chatId, text) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur envoi message:', error);
    return false;
  }
}

// Template de confirmation de commande
function generateOrderSummary(order) {
  const itemsList = order.items.map(item => `• ${item.name} x${item.quantity} - €${item.price.toFixed(2)}`).join('\n');
  
  return `✅ *Confirmation de commande*

📋 *Référence*: ${order.ref}
📧 *Email*: ${order.email || 'Non fourni'}
📱 *Téléphone*: ${order.phone}

🛍️ *Vos articles*:
${itemsList}

💰 *Total*: €${order.total.toFixed(2)}

🚚 *Livraison*:
${order.delivery}
⏱️ Estimation: ${order.estimate}

✅ *Prochaines étapes*:
Notre équipe vous contactera pour finaliser les détails de livraison.

🙏 *Merci de votre confiance !*
L'équipe ChronoMedical

---
_Commande du ${order.date}_`;
}

// Endpoint pour recevoir les nouvelles commandes
app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    
    // Validation des données
    if (!orderData.orderRef || !orderData.phone || !orderData.items) {
      return res.status(400).json({ error: 'Données de commande manquantes' });
    }

    // Ajouter la commande au système
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
    console.log(`Nouvelle commande reçue: ${orderData.orderRef}`);
    
    res.json({ 
      success: true, 
      message: 'Commande enregistrée avec succès',
      orderRef: orderData.orderRef
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Endpoint pour tester la connectivité
app.get('/api/orders', (req, res) => {
  const { ref } = req.query;
  
  if (ref) {
    // Récupérer une commande spécifique
    const order = orders[ref];
    if (order) {
      res.json({
        success: true,
        order: order,
        found: true
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée',
        ref: ref
      });
    }
  } else {
    // Test de connectivité
    res.json({ 
      status: 'OK', 
      message: 'Endpoint orders fonctionnel',
      timestamp: new Date().toISOString(),
      orderCount: Object.keys(orders).length
    });
  }
});

// Webhook pour les messages Telegram
app.post('/api/webhook', async (req, res) => {
  try {
    const { message, edited_message } = req.body;
    const currentMessage = message || edited_message;

    if (!currentMessage || !currentMessage.text) {
      return res.status(200).json({ status: 'ok' });
    }

    const chatId = currentMessage.chat.id;
    const text = currentMessage.text.trim();
    const username = currentMessage.from.username || 'utilisateur';

    console.log(`Message reçu de @${username}: ${text}`);

    // Vérifier si c'est un numéro de commande
    if (text.startsWith('CM-') && text.length > 10) {
      const orderRef = text;
      const order = orders[orderRef];

      if (order) {
        const confirmation = generateOrderSummary(order);
        await sendTelegramMessage(chatId, confirmation);
        console.log(`Confirmation envoyée pour ${orderRef}`);
      } else {
        const notFoundMessage = `❌ *Numéro de commande non trouvé*

Le numéro "${orderRef}" n'existe pas dans notre système.

💡 *Vérifiez*:
• Que vous avez copié le numéro complet
• Qu'il n'y a pas d'espaces supplémentaires
• Que la commande a bien été passée

📞 *Besoin d'aide ?*
Contactez notre équipe qui pourra vérifier votre commande manuellement.`;

        await sendTelegramMessage(chatId, notFoundMessage);
        console.log(`Commande non trouvée: ${orderRef}`);
      }
    } 
    // Commande /start ou message de bienvenue
    else if (text.startsWith('/start') || text.toLowerCase().includes('hello') || text.toLowerCase().includes('bonjour')) {
      const welcomeMessage = `Bonjour ! 👋

🎉 *Bienvenue chez ChronoMedical*

Pour recevoir votre confirmation de commande :
📋 Envoyez simplement votre *numéro de commande* (format: CM-XXXXX-XXX)

💡 *Exemple*: CM-ABC123-XYZ

Notre équipe vous contactera ensuite pour organiser la livraison.

🌐 *Passer une commande*: https://chronomedical.netlify.app/`;

      await sendTelegramMessage(chatId, welcomeMessage);
      console.log(`Message de bienvenue envoyé à @${username}`);
    }
    // Message d'aide par défaut
    else {
      const helpMessage = `🤖 *ChronoMedical Bot*

Pour recevoir votre confirmation :
📋 Envoyez votre *numéro de commande* (format: CM-XXXXX-XXX)

❓ *Vous n'avez pas de numéro ?*
Passez votre commande sur : https://chronomedical.netlify.app/

📞 *Problème ?*
Notre équipe peut vous aider à retrouver votre commande.`;

      await sendTelegramMessage(chatId, helpMessage);
    }

    res.json({ status: 'ok' });

  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur ChronoMedical fonctionnel !',
    timestamp: new Date().toISOString()
  });
});

// Page d'accueil
app.get('/', (req, res) => {
  res.json({
    service: 'ChronoMedical Webhook',
    status: 'Running',
    endpoints: {
      orders: '/api/orders',
      webhook: '/api/webhook',
      test: '/api/test'
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Serveur ChronoMedical démarré sur le port ${port}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   - POST /api/orders (nouvelles commandes)`);
  console.log(`   - GET /api/orders (test et récupération)`);
  console.log(`   - POST /api/webhook (messages Telegram)`);
  console.log(`   - GET /api/test (test de connectivité)`);
}); 