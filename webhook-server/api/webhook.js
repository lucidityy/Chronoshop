// Webhook pour bot Telegram - Déployable sur Vercel
const BOT_TOKEN = '7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA';

// Base de données simple des commandes (en production, utilisez une vraie DB)
let orders = {};

// Fonction pour récupérer une commande depuis l'endpoint orders
async function getOrderFromAPI(orderRef) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://y-9ixxp0ij1-1gotscarzs-projects.vercel.app';
    
    const response = await fetch(`${baseUrl}/api/orders?ref=${orderRef}`);
    if (response.ok) {
      const data = await response.json();
      return data.order || null;
    }
  } catch (error) {
    console.error('Erreur récupération commande depuis API:', error);
  }
  return null;
}

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

// Handler principal du webhook
export default async function handler(req, res) {
  // Headers CORS pour permettre les requêtes depuis n'importe quel domaine
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, edited_message } = req.body;
    const currentMessage = message || edited_message;

    if (!currentMessage || !currentMessage.text) {
      return res.status(200).json({ status: 'ok' });
    }

    const chatId = currentMessage.chat.id;
    const text = currentMessage.text.trim();
    const username = currentMessage.from.username;

    console.log(`Message reçu de @${username}: ${text}`);

    // Vérifier si c'est un numéro de commande
    if (text.startsWith('CM-') && text.length > 10) {
      const orderRef = text;
      
      // Essayer de récupérer la commande depuis l'API orders d'abord
      let order = await getOrderFromAPI(orderRef);
      
      // Si pas trouvée, essayer dans la base locale
      if (!order) {
        order = orders[orderRef];
      }

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

    return res.status(200).json({ status: 'ok' });

  } catch (error) {
    console.error('Erreur webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Fonction pour ajouter une commande (appelée par votre app)
export async function addOrder(orderData) {
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