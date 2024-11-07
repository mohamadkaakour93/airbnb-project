const express = require('express');
const router = express.Router();
const Bien = require('../models/bien');
const verifyToken = require('../middleware/auth');
const {ajouterAvis } = require('../controllers/avisController'); 


router.get('/mes-biens', verifyToken, async (req, res) => {
  try {
    const proprietaireEmail = req.user.email; // Vérifiez que `req.user.email` est bien défini
    const biens = await Bien.find({ emailProprietaire: proprietaireEmail });
    res.status(200).json(biens);
  } catch (error) {
    console.error('Erreur lors de la récupération des biens du propriétaire:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des biens du propriétaire.' });
  }
});



// Route pour obtenir tous les biens
router.get('/', async (req, res) => {
  try {
    const biens = await Bien.find({});
    res.status(200).json(biens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); 

// Route pour les filtres

router.get('/filter', async (req, res) => {
  const { location, dateDebut, dateFin } = req.query;
  console.log('Paramètres reçus:', { location, dateDebut, dateFin });

  let query = {};

  // Filtre par lieu
  if (location) {
    query.commune = new RegExp(location, 'i'); // Recherche insensible à la casse
  }

  // Filtre par disponibilité
  if (dateDebut && dateFin) {
    const debutDate = new Date(dateDebut);
    const finDate = new Date(dateFin);

    query['$and'] = [
      { dateFin: { $gte: debutDate } }, // Disponible jusqu'à la date de début
      { dateDebut: { $lte: finDate } }  // Disponible à partir de la date de fin
    ];
  }

  try {
    console.log('Requête MongoDB corrigée:', JSON.stringify(query, null, 2)); // Log détaillé
    const biens = await Bien.find(query);
    console.log('Résultat des biens filtrés:', biens);
    res.status(200).json(biens);
  } catch (error) {
    console.error('Erreur lors du filtrage des biens:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des biens.' });
  }
});


// Route pour obtenir un bien par ID
// Obtenir un bien par ID
router.get('/:id', async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id).populate('avis.utilisateur', 'prenom nom');
    if (!bien) {
      return res.status(404).json({ message: 'Bien non trouvé.' });
    }
    res.status(200).json(bien); // Renvoie directement l'objet Bien
  } catch (error) {
    console.error('Erreur lors de la récupération du bien:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


router.post('/', verifyToken, async (req, res) => {
  try {
    // Créer le bien avec les données de la requête
    const newBien = new Bien(req.body);
    
    // Sauvegarder pour obtenir le champ `_id` généré
    await newBien.save();

    // Définir `idBien` avec la valeur de `_id`
    newBien.idBien = newBien._id;

    // Sauvegarder à nouveau pour inclure `idBien`
    await newBien.save();

    // Renvoyer le bien avec `idBien` défini
    res.status(201).json(newBien);
  } catch (err) {
    // Capture et renvoie de l'erreur en cas de problème
    res.status(400).json({ error: err.message });
  }
});





router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Récupérer le bien par son ID
    const bien = await Bien.findById(req.params.id);
    
    // Vérifier si le bien existe
    if (!bien) return res.status(404).json({ message: 'Bien non trouvé' });

    // Vérifier si l'utilisateur est le propriétaire du bien
    if (bien.emailProprietaire !== req.user.email) {
      return res.status(403).json({ message: "Vous n'avez pas le droit de modifier ce bien" });
    }

    // Mettre à jour le bien si l'utilisateur est le propriétaire
    const updatedBien = await Bien.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBien);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route pour supprimer un bien par ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBien = await Bien.findByIdAndDelete(req.params.id);
    if (!deletedBien) return res.status(404).json({ message: 'Bien non trouvé' });
    res.status(200).json({ message: 'Bien supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/avis', async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id).populate('avis.utilisateur', 'prenom nom');;
    if (!bien) {
      return res.status(404).json({ message: 'Bien non trouvé.' });
    }

    const { note, commentaire, date, utilisateur } = req.body;
    const avis = { note, commentaire, date, utilisateur };
    bien.avis.push(avis);
    await bien.save();

    res.status(201).json(bien.avis[bien.avis.length - 1]); // Renvoie le dernier avis ajouté
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});




module.exports = router;
