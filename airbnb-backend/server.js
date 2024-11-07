const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import de cors pour la gestion du CORS
const app = express();
const path = require('path');


// Définir le port
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Autorise toutes les origines
app.use(express.json()); // Pour analyser les requêtes JSON

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/airbnb_project', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Import des routes
const userRoutes = require('./routes/user');
const bienRoutes = require('./routes/bien');
const authRoutes = require('./routes/auth'); 
const reservationsRoutes = require('./routes/reservations');


// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/biens', bienRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/reservations', reservationsRoutes);
// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur interne du serveur :', err.stack);
  res.status(500).send('Une erreur interne est survenue');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
