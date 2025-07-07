# 🚀 Configuration Webhook Automatique - Guide Complet

## 🎯 Objectif
Transformer votre bot Telegram en assistant automatique qui répond instantanément aux numéros de commande !

## 📋 Étapes de Configuration

### 1. **Préparer le Serveur Webhook**

Les fichiers du serveur webhook ont été créés dans `webhook-server/` :
- `api/webhook.js` - Handler principal des messages Telegram
- `api/orders.js` - Endpoint pour recevoir les commandes
- `package.json` - Configuration du projet
- `vercel.json` - Configuration de déploiement

### 2. **Déployer sur Vercel (Gratuit)**

```bash
# Aller dans le dossier webhook
cd webhook-server

# Installer Vercel CLI globalement
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
vercel --prod
```

**Suivre les instructions :**
- Link to existing project? `No`
- Project name: `chronomedical-webhook`
- Directory: `./` (webhook-server)
- Override settings? `No`

**Résultat :** Vous obtenez une URL comme `https://chronomedical-webhook.vercel.app`

### 3. **Configurer le Webhook Telegram**

Remplacez `YOUR-VERCEL-URL` par votre URL Vercel :

```bash
curl -X POST "https://api.telegram.org/bot7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR-VERCEL-URL.vercel.app/api/webhook"}'
```

**Vérifier que ça marche :**
```bash
curl "https://api.telegram.org/bot7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA/getWebhookInfo"
```

### 4. **Modifier votre App Web**

Dans `src/App.tsx`, ligne 678, remplacez :
```javascript
const WEBHOOK_URL = 'https://chronomedical-webhook.vercel.app/api/orders';
```

Par votre vraie URL Vercel.

### 5. **Redéployer votre App**

```bash
# Depuis le dossier principal de votre projet
npm run build

# Si vous utilisez Netlify
netlify deploy --prod

# Ou git push si auto-déployé
git add .
git commit -m "Add webhook integration"
git push origin main
```

## 🧪 Tester le Système

### Test 1 : Vérifier le webhook
```bash
# Tester que le webhook répond
curl -X POST "https://YOUR-VERCEL-URL.vercel.app/api/webhook" \
  -H "Content-Type: application/json" \
  -d '{"message": {"chat": {"id": 123}, "from": {"username": "test"}, "text": "hello"}}'
```

### Test 2 : Simulation complète
1. **Passer une commande** sur votre app web
2. **Copier le numéro de commande** (format CM-XXXXX-XXX)
3. **L'envoyer au bot** : https://t.me/ChronoShopBot
4. **Vérifier la réponse automatique** 🎉

## 🔧 Fonctionnalités du Bot

### Messages Automatiques
- **Numéro de commande** → Confirmation détaillée
- **"Bonjour" / "Hello"** → Message de bienvenue
- **Autres messages** → Instructions d'aide

### Gestion des Erreurs
- **Commande non trouvée** → Message d'aide
- **Format incorrect** → Instructions sur l'utilisation
- **Erreurs serveur** → Logs détaillés

## 🎯 Workflow Final

```
1. Client passe commande → App Web
2. App Web → Envoie données au webhook
3. Webhook → Stocke la commande
4. Client → Envoie référence au bot
5. Bot → Reçoit message via webhook
6. Webhook → Trouve commande et répond
7. Client → Reçoit confirmation automatique ✅
```

## 🚨 Dépannage

### Webhook ne répond pas
```bash
# Vérifier les logs Vercel
vercel logs

# Vérifier la configuration
curl "https://api.telegram.org/bot7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA/getWebhookInfo"
```

### Commandes non trouvées
- Vérifier que l'app web envoie bien au webhook
- Consulter les logs Vercel pour les erreurs
- Vérifier que l'URL webhook est correcte dans App.tsx

### Bot ne répond pas
```bash
# Réinitialiser le webhook
curl -X POST "https://api.telegram.org/bot7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": ""}'

# Remettre le webhook
curl -X POST "https://api.telegram.org/bot7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR-VERCEL-URL.vercel.app/api/webhook"}'
```

## 📈 Améliorations Possibles

### Base de Données Persistante
- Remplacer le stockage en mémoire par MongoDB/PostgreSQL
- Éviter la perte de données lors des redéploiements

### Notifications Avancées
- Envoyer des notifications à l'équipe lors de nouvelles commandes
- Système de statuts de commande

### Monitoring
- Tracking des erreurs avec Sentry
- Métriques d'utilisation du bot

## 🎉 Résultat Final

**Avant** : Confirmations manuelles via équipe  
**Après** : Confirmations automatiques 24/7 ! 🚀

**Expérience client** :
1. Commande en 2 minutes
2. Référence instantanée
3. Confirmation automatique
4. Contact équipe pour livraison

**Aucune intervention manuelle requise !**

---

## 🆘 Support

Si vous avez des questions ou des problèmes :
1. Vérifiez les logs Vercel
2. Testez chaque étape individuellement
3. Consultez la documentation Telegram Bot API
4. Contactez le support technique

🎯 **Objectif atteint** : Bot entièrement automatisé et expérience client parfaite ! 