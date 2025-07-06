# 📧 Configuration de l'envoi automatique d'emails

## 🎯 Solutions recommandées pour les confirmations par email

### **Option 1 : Zapier (Recommandée - Simple)**

1. **Créer un compte Zapier** : https://zapier.com
2. **Créer un nouveau Zap** :
   - **Trigger** : Webhooks by Zapier → Catch Hook
   - **Action** : Gmail/Outlook → Send Email

3. **Configuration** :
   - Copier l'URL webhook fournie par Zapier
   - Remplacer `https://webhook.site/your-webhook-url` dans le code par votre URL Zapier
   - Configurer le template d'email dans Zapier

4. **Template email suggéré** :
```
Objet: Confirmation de commande ChronoMedical #{{orderRef}}

Bonjour,

Merci pour votre commande ChronoMedical !

📋 RÉCAPITULATIF DE COMMANDE
Référence: #{{orderRef}}
Date: {{timestamp}}

🛍️ VOS ARTICLES
{{#each items}}
• {{name}} x{{quantity}} - €{{price}}
{{/each}}

💰 TOTAL: €{{total}}

🚚 LIVRAISON
Type: {{delivery.type}}
{{#if delivery.address}}Adresse: {{delivery.address}}{{/if}}
Estimation: {{delivery.estimate}}

✅ PROCHAINES ÉTAPES
Notre équipe vous contactera via Telegram ({{customer.telegram}}) pour finaliser les détails de livraison.

🙏 Merci de votre confiance !
L'équipe ChronoMedical

---
Cet email a été envoyé automatiquement. Ne pas répondre.
```

### **Option 2 : Make.com (Anciennement Integromat)**

1. **Créer un compte** : https://make.com
2. **Créer un scénario** :
   - **Webhook** → **Email** (Gmail/Outlook)
3. **Remplacer l'URL** dans le code

### **Option 3 : Service personnalisé (Avancé)**

Si vous avez un serveur :

```javascript
// Exemple avec Nodemailer
app.post('/send-confirmation', async (req, res) => {
  const { data } = req.body;
  
  const mailOptions = {
    from: 'noreply@chronomedical.com',
    to: data.to,
    subject: data.subject,
    html: generateEmailTemplate(data)
  };
  
  await transporter.sendMail(mailOptions);
  res.status(200).send('OK');
});
```

## 🔧 Configuration dans le code

Dans `src/App.tsx`, ligne ~610, remplacez :
```javascript
await fetch('https://webhook.site/your-webhook-url', {
```

Par votre URL webhook réelle :
```javascript
await fetch('https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/', {
```

## 📝 Données envoyées

Le système envoie automatiquement ces données :
```json
{
  "type": "email_confirmation",
  "data": {
    "to": "client@email.com",
    "subject": "Confirmation de commande ChronoMedical #CM-ABC123",
    "orderRef": "CM-ABC123-XYZ",
    "customer": {
      "telegram": "@username",
      "phone": "+33123456789",
      "email": "client@email.com"
    },
    "items": [
      {
        "name": "White Premium",
        "quantity": 2,
        "price": 89.99
      }
    ],
    "total": 179.98,
    "delivery": {
      "type": "home",
      "address": "123 Rue Example",
      "estimate": "24-48h"
    },
    "timestamp": "25/01/2025 à 22:30:15"
  }
}
```

## ✅ Avantages de cette solution

- ✅ **Confirmation instantanée** par email
- ✅ **Pas de limitation Telegram** 
- ✅ **Archives automatiques** des commandes
- ✅ **Templates personnalisables**
- ✅ **Fiable et professionnel**

## 🚀 Déploiement

Une fois configuré :
1. Remplacez l'URL webhook dans le code
2. Committez et poussez sur GitHub
3. Netlify redéploiera automatiquement
4. Testez avec une commande réelle

## 💡 Conseil

Gardez aussi le système Telegram pour l'équipe - c'est parfait pour avoir les 2 :
- **Email** → Confirmation client automatique
- **Telegram** → Notification équipe instantanée 