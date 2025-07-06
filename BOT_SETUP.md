# 🤖 Configuration du Bot Telegram pour réponses automatiques

## 🎯 Principe de fonctionnement

Quand un client envoie un numéro de commande (ex: `CM-ABC123-XYZ`) au bot @ChronoShopBot, le bot répond automatiquement avec le récapitulatif complet de la commande.

## 🔧 Options de configuration

### **Option 1 : Bot simple avec BotFather (Recommandée)**

1. **Configurer les commandes du bot** via @BotFather :
   - Envoyez `/setcommands` à @BotFather
   - Sélectionnez @ChronoShopBot
   - Ajoutez cette commande :
   ```
   start - Commencer une conversation
   ```

2. **Message de bienvenue** :
   ```
   Bonjour ! 👋
   
   Pour recevoir votre confirmation de commande ChronoMedical :
   📋 Envoyez simplement votre numéro de commande (ex: CM-ABC123-XYZ)
   
   Notre équipe vous contactera ensuite pour organiser la livraison.
   ```

### **Option 2 : Bot automatisé avec webhook (Avancé)**

Si vous voulez automatiser complètement les réponses :

1. **Configurer un webhook** pour votre bot :
   ```bash
   curl -X POST "https://api.telegram.org/bot7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA/setWebhook" \
        -d "url=https://votre-serveur.com/webhook"
   ```

2. **Code serveur exemple** (Node.js) :
   ```javascript
   const express = require('express');
   const app = express();
   
   // Base de données simple des commandes (à remplacer par vraie DB)
   const orders = {
     'CM-ABC123-XYZ': {
       ref: 'CM-ABC123-XYZ',
       client: '@username',
       email: 'client@email.com',
       phone: '+33123456789',
       items: ['White Premium x2 - €179.98', 'Keta Special x1 - €129.99'],
       total: '€309.97',
       delivery: 'Domicile - 123 Rue Example, Paris',
       estimate: '24-48h',
       date: '25/01/2025 à 22:30:15'
     }
   };
   
   app.post('/webhook', (req, res) => {
     const { message } = req.body;
     
     if (message && message.text) {
       const orderRef = message.text.trim();
       const order = orders[orderRef];
       
       if (order) {
         const response = generateOrderSummary(order);
         sendTelegramMessage(message.chat.id, response);
       } else if (orderRef.startsWith('CM-')) {
         sendTelegramMessage(message.chat.id, 
           '❌ Numéro de commande non trouvé. Vérifiez votre numéro ou contactez notre équipe.'
         );
       }
     }
     
     res.status(200).send('OK');
   });
   
   function generateOrderSummary(order) {
     return `✅ *Confirmation de commande*
   
   📋 *Référence*: ${order.ref}
   📧 *Email*: ${order.email}
   📱 *Téléphone*: ${order.phone}
   
   🛍️ *Vos articles*:
   ${order.items.join('\n')}
   
   💰 *Total*: ${order.total}
   
   🚚 *Livraison*:
   ${order.delivery}
   ⏱️ Estimation: ${order.estimate}
   
   ✅ *Prochaines étapes*:
   Notre équipe vous contactera pour finaliser la livraison.
   
   🙏 *Merci de votre confiance !*
   L'équipe ChronoMedical
   
   ---
   _Commande du ${order.date}_`;
   }
   ```

### **Option 3 : Solution manuelle simple**

**Pour chaque nouvelle commande** :

1. **Vous recevez** le message équipe avec les données formatées
2. **Le client** vous envoie son numéro de commande au bot
3. **Vous répondez** manuellement avec ce template :

```
✅ **Confirmation de commande**

📋 **Référence**: [COPIER LE REF]
📧 **Email**: [COPIER EMAIL]
📱 **Téléphone**: [COPIER PHONE]

🛍️ **Vos articles**:
[COPIER ITEMS]

💰 **Total**: [COPIER TOTAL]

🚚 **Livraison**:
[COPIER DELIVERY INFO]
⏱️ Estimation: [COPIER ESTIMATE]

✅ **Prochaines étapes**:
Notre équipe vous contactera pour finaliser la livraison.

🙏 **Merci de votre confiance !**
L'équipe ChronoMedical

---
_Commande du [COPIER DATE]_
```

## 🎯 Workflow client

1. **Client passe commande** sur https://chronomedical.netlify.app/
2. **Page de confirmation** affiche :
   - Le numéro de commande à copier
   - Un bouton direct vers le bot avec le numéro pré-rempli
3. **Client clique** ou copie-colle le numéro dans le bot
4. **Bot répond** automatiquement avec le récapitulatif
5. **Équipe contacte** le client pour la livraison

## ✅ Avantages de cette solution

- ✅ **Simple** : Le client fait juste un copier-coller
- ✅ **Automatique** : Plus de transfert manuel de confirmations
- ✅ **Fiable** : Le client initie la conversation, pas de limitation
- ✅ **Professionnel** : Process clair et organisé
- ✅ **Évolutif** : Peut être automatisé complètement plus tard

## 🚀 Test de fonctionnement

1. Passez une commande test sur l'app
2. Copiez le numéro de commande affiché
3. Envoyez-le à @ChronoShopBot
4. Vérifiez que le bot répond correctement

## 💡 Conseils

- **Gardez une base de données** des commandes pour automatiser
- **Utilisez les données formatées** du message équipe
- **Testez régulièrement** le process avec de vraies commandes
- **Formez votre équipe** sur le nouveau workflow

Cette solution transforme la "limitation" en fonctionnalité pratique ! 🎉 