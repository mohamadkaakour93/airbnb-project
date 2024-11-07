// updateBiensImages.js

const mongoose = require('mongoose');
const Bien = require('./models/bien'); // Assurez-vous que le chemin est correct

// Remplacez par votre URI MongoDB
const mongoURI = 'mongodb://localhost:27017/airbnb_project';

// Tableau des mises à jour : { _id: 'id_du_bien', imageUrl: 'URL_de_l_image' }
const updates = [
  {
    _id: '671a2cd086188af859fe6915',
    imageUrl: 'https://images.app.goo.ghttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80l/8pBsJYwzcm4cU11c8'
  },
  {
    _id: '671a2cd086188af859fe6916',
    imageUrl: 'https://images.app.ghttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80oo.gl/GV3Qw28AVEuYQnhYA'
  },

  { _id: '671a2cd086188af859fe6917',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },

  { _id: '671a2cd086188af859fe6918',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },



  
];

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connecté à MongoDB');

    for (const update of updates) {
      const { _id, imageUrl } = update;
      try {
        const bien = await Bien.findByIdAndUpdate(_id, { imageUrl }, { new: true });
        if (bien) {
          console.log(`Bien ${bien._id} mis à jour avec imageUrl.`);
        } else {
          console.log(`Bien avec _id ${_id} non trouvé.`);
        }
      } catch (err) {
        console.error(`Erreur lors de la mise à jour du bien ${_id}:`, err.message);
      }
    }

    mongoose.disconnect();
  })
  .catch(err => console.error('Erreur de connexion à MongoDB:', err.message));
