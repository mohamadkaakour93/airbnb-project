const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config'); // Assurez-vous que le chemin est correct

console.log('JWT Secret dans auth.js:', config.jwtSecret); // Ajoutez ce log pour vérifier
console.log('JWT Expire dans auth.js:', config.jwtExpire); // Ajoutez ce log pour vérifier

// Route de login
/*router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Utilisateur non trouvé pour l\'email:', email);
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error('Mot de passe incorrect pour l\'email:', email);
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Créer le token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret, // Utilisation de config.jwtSecret
      { expiresIn: config.jwtExpire } // Utilisation de config.jwtExpire
    );

    console.log('Token généré pour l\'utilisateur:', user.email);
    res.json({ token, user });
  } catch (err) {
    console.error('Erreur lors de la connexion :', err.message);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});*/


// Route de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      console.error("Utilisateur non trouvé pour l'email:", email);
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error("Mot de passe incorrect pour l'email:", email);
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Créer le token avec l'email inclus
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Ajoutez `email` ici
      config.jwtSecret, // Utilisation de config.jwtSecret
      { expiresIn: config.jwtExpire } // Utilisation de config.jwtExpire
    );

    console.log("Token généré pour l'utilisateur:", user.email);
    res.json({ token, user });
  } catch (err) {
    console.error('Erreur lors de la connexion :', err.message);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});



// signup 

router.post('/signup', async (req, res) => {
  const { email, password, prenom, nom, telephone, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      console.log('Utilisateur déjà existant:', email);
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    // Créer un nouvel utilisateur
    user = new User({
      email,
      password,
      prenom,
      nom,
      telephone,
      role: role || 'user' // Assignation du rôle par défaut
    });

    await user.save();
    console.log('Nouvel utilisateur créé:', user);

    // Créer le token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err.message);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});

module.exports = router;