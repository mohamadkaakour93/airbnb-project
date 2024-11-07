const jwt = require('jsonwebtoken');
const config = require('../config'); // Votre clé secrète JWT

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni.' });
  }

  const token = authHeader.split(' ')[1]; // Enlever le mot 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Définir req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Jeton invalide.' });
  }
}

module.exports = verifyToken;

