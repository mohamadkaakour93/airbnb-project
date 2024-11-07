// controllers/avisController.js

/*const Bien = require('../models/bien');

const ajouterAvis = async (req, res) => {
  const { id } = req.params; // ID du bien
  const { note, commentaire } = req.body; // Détails de l'avis

  console.log('Ajouter avis pour le bien ID:', id);
  console.log('Données de l\'avis:', { note, commentaire });

  try {
    const bien = await Bien.findById(id);
    if (!bien) {
      console.error('Bien non trouvé avec l\'ID:', id);
      return res.status(404).json({ message: 'Bien non trouvé' });
    }

    const avis = { 
      note, 
      commentaire, 
      utilisateur: req.userId // ID de l'utilisateur authentifié
    };
    bien.avis.push(avis);
    await bien.save();

    console.log('Avis ajouté:', avis);
    res.status(201).json({ message: 'Avis ajouté avec succès', avis });
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'avis:', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = ajouterAvis;*/
