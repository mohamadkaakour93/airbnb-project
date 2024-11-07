// routes/reservations.js

const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const Bien = require('../models/bien');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

/*// Vérifier les disponibilités
async function isBienDisponible(bienId, dateDebut, dateFin) {
  const reservations = await Reservation.find({
    bien: bienId,
    $or: [
      {
        dateDebut: { $lte: dateFin },
        dateFin: { $gte: dateDebut }
      }
    ],
    statut: { $ne: 'annulée' }
  });

  return reservations.length === 0;
}

//Créer une réservation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const utilisateurId = req.user.id;
    const { bienId, dateDebut, dateFin } = req.body;

    // Créer la réservation
    const reservation = new Reservation({
      bien: bienId,
      utilisateur: utilisateurId,
      dateDebut,
      dateFin,
      statut: 'en attente'
    });

    await reservation.save();

    res.status(201).json({ reservation });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});*/ 

async function isBienDisponible(bienId, dateDebut, dateFin, utilisateurId) {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);

  console.log('--- Vérification de disponibilité ---');
  console.log('Bien ID:', bienId);
  console.log('Utilisateur ID:', utilisateurId);
  console.log('Dates de réservation demandées:', { debut, fin });

  // Rechercher les réservations du même utilisateur pour le même bien et les mêmes dates
  const reservationExistante = await Reservation.findOne({
    bien: bienId,
    utilisateur: utilisateurId,
    dateDebut: debut,
    dateFin: fin,
    statut: { $ne: 'annulée' }
  });

  if (reservationExistante) {
    console.log('Une réservation existante pour cet utilisateur a été trouvée:', reservationExistante);
    // L'utilisateur a déjà une réservation pour ces dates
    return { disponible: false, dejaReserve: true };
  } else {
    console.log('Aucune réservation existante pour cet utilisateur sur ces dates.');
  }

  // Rechercher les réservations conflictuelles pour le bien en excluant l'utilisateur actuel
  const reservations = await Reservation.find({
    bien: bienId,
    utilisateur: { $ne: utilisateurId }, // Exclure l'utilisateur actuel
    $or: [
      { dateDebut: { $lte: fin }, dateFin: { $gte: debut } },
      { dateDebut: { $gte: debut, $lte: fin } },
      { dateFin: { $gte: debut, $lte: fin } }
    ],
    statut: { $ne: 'annulée' } // Exclure les réservations annulées
  });

  console.log('Nombre de réservations conflictuelles trouvées:', reservations.length);
  console.log('Détails des réservations conflictuelles:', reservations);

  // Retourne un objet avec la disponibilité et l'information sur la réservation existante
  return { disponible: reservations.length === 0, dejaReserve: false };
}

// Route pour créer une réservation avec vérification de disponibilité et de double réservation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const utilisateurId = req.user.id;
    const { bienId, dateDebut, dateFin } = req.body;

    console.log('--- Création de réservation ---');
    console.log('Bien ID:', bienId);
    console.log('Utilisateur ID:', utilisateurId);
    console.log('Dates demandées:', { dateDebut, dateFin });

    // Vérifiez si le bien est disponible et si l'utilisateur a déjà réservé pour les mêmes dates
    const { disponible, dejaReserve } = await isBienDisponible(bienId, dateDebut, dateFin, utilisateurId);

    if (dejaReserve) {
      console.log('Erreur : Réservation déjà effectuée pour cet utilisateur sur ces dates.');
      return res.status(400).json({ message: 'Vous avez déjà réservé ce bien pour les dates sélectionnées.' });
    }

    if (!disponible) {
      console.log('Erreur : Le bien est indisponible pour les dates sélectionnées.');
      return res.status(400).json({ message: 'Le bien est indisponible pour les dates sélectionnées.' });
    }

    // Créer la réservation si le bien est disponible et aucune double réservation n'est trouvée
    const reservation = new Reservation({
      bien: bienId,
      utilisateur: utilisateurId,
      dateDebut,
      dateFin,
      statut: 'en attente'
    });

    await reservation.save();
    console.log('Réservation créée avec succès:', reservation);

    res.status(201).json({ reservation });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


// pour le loueur 
// Middleware pour vérifier le rôle de loueur
function verifyRole(role) {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'Accès interdit.' });
    }
  };
}



// Route pour accepter une réservation sans vérification par email
router.put('/:id/accepter', authMiddleware, verifyRole('loueur'), async (req, res) => {
  const reservationId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    return res.status(400).json({ message: 'ID de réservation invalide.' });
  }

  try {
    const reservation = await Reservation.findById(reservationId).populate('bien');

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Vérification du statut uniquement
    if (reservation.statut !== 'en attente') {
      return res.status(400).json({ message: `Impossible de changer le statut de cette réservation. Statut actuel: ${reservation.statut}` });
    }

    reservation.statut = 'confirmée';
    await reservation.save();

    res.status(200).json({ message: 'Réservation acceptée avec succès.', reservation });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la réservation:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour annuler une réservation sans vérification par email
router.put('/:id/annuler', authMiddleware, verifyRole('loueur'), async (req, res) => {
  const reservationId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    return res.status(400).json({ message: 'ID de réservation invalide.' });
  }

  try {
    const reservation = await Reservation.findById(reservationId).populate('bien');

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Vérification du statut uniquement
    if (reservation.statut !== 'en attente') {
      return res.status(400).json({ message: `Impossible de changer le statut de cette réservation. Statut actuel: ${reservation.statut}` });
    }

    reservation.statut = 'annulée';
    await reservation.save();

    res.status(200).json({ message: 'Réservation annulée avec succès.', reservation });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});




// Obtenir les réservations pour le loueur
router.get('/reservations-loueur', authMiddleware, verifyRole('loueur'), async (req, res) => {
  try {
    const loueurEmail = req.user.email;
    console.log('Loueur Email:', loueurEmail);

    // Trouver tous les biens appartenant au loueur
    const biens = await Bien.find({ emailProprietaire: loueurEmail}).select('_id');
    console.log('Biens du loueur:', biens);

    const bienIds = biens.map(bien => bien._id);
    console.log('Biens du loueur:', biens);
    // Trouver les réservations liées à ces biens
    const reservations = await Reservation.find({ bien: { $in: bienIds } })
      .populate('bien')
      .populate('utilisateur', 'prenom nom')
      .sort({ dateDebut: -1 });

    console.log(`Réservations récupérées pour le loueur ${loueurEmail}:`, reservations);

    res.status(200).json({ reservations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}); 

// Route pour récupérer les réservations de l'utilisateur connecté
router.get('/mes-reservations', authMiddleware, async (req, res) => {
  try {
    const utilisateurId = req.user.id; // Récupère l'ID de l'utilisateur depuis le token JWT

    // Trouver les réservations de cet utilisateur
    const reservations = await Reservation.find({ utilisateur: utilisateurId })
      .populate('bien', 'commune rue prix') // Inclure les informations sur le bien
      .sort({ dateDebut: -1 });

    console.log(`Réservations récupérées pour l'utilisateur ${utilisateurId}:`, reservations);

    res.status(200).json({ reservations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


module.exports = router;
