// Endpoint de test simple
export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Réponse simple pour tous les types de requêtes
  return res.status(200).json({
    status: 'OK',
    message: 'Test endpoint fonctionne !',
    method: req.method,
    timestamp: new Date().toISOString(),
    url: req.url
  });
} 