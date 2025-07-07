# 🤖 ChronoMedical Webhook Server

Serveur webhook automatique pour le bot Telegram @ChronoShopBot

## 🚀 Déploiement rapide sur Vercel

### 1. Prérequis
- Compte Vercel (gratuit)
- Git installé

### 2. Déployer le webhook
```bash
# Cloner ou copier ce dossier
cd webhook-server

# Installer Vercel CLI
npm install -g vercel

# Déployer (première fois)
vercel --prod

# Suivre les instructions :
# - Link to existing project? No
# - Project name: chronomedical-webhook
# - Directory: ./
# - Override settings? No
```

### 3. Configurer le webhook Telegram
Une fois déployé, vous obtiendrez une URL comme :
`https://chronomedical-webhook.vercel.app`

**Configurez le webhook :**
```bash
curl -X POST "https://api.telegram.org/bot7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://VOTRE-URL-VERCEL.vercel.app/api/webhook"}'
```

### 4. Modifier votre app web
Mettez à jour l'URL du webhook dans votre App.tsx :
```javascript
const WEBHOOK_URL = 'https://VOTRE-URL-VERCEL.vercel.app/api/orders';
```

## 📝 URLs importantes

- **Webhook Telegram** : `/api/webhook` (reçoit les messages du bot)
- **Endpoint commandes** : `/api/orders` (reçoit les nouvelles commandes de l'app)

## 🔧 Fonctionnalités

✅ **Automatique** : Répond instantanément aux numéros de commande  
✅ **Intelligent** : Messages d'aide et de bienvenue  
✅ **Robuste** : Gestion d'erreurs et validation  
✅ **Gratuit** : Hébergement sur Vercel  

## 🛠️ Test local

```bash
# Installer les dépendances
npm install

# Lancer en local
vercel dev

# Tester : http://localhost:3000/api/webhook
```

## 🔄 Mises à jour

```bash
# Redéployer après modifications
vercel --prod
```

## 💡 Notes importantes

- **Sécurité** : Le token du bot est intégré (OK pour ce projet)
- **Base de données** : Stockage en mémoire (réinitialisé à chaque déploiement)
- **Évolutif** : Facilement extensible avec une vraie DB (MongoDB, PostgreSQL, etc.)

## 🎯 Workflow complet

1. **Client** passe commande → App web
2. **App web** envoie données → `/api/orders`
3. **Client** envoie référence → Bot Telegram
4. **Bot** reçoit message → `/api/webhook`
5. **Webhook** trouve commande → Envoie confirmation

**Résultat** : Confirmations automatiques 24/7 ! 🚀 