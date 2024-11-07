const mongoose = require('mongoose');
const avisSchema = new mongoose.Schema({
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


const bienSchema = new mongoose.Schema({
  emailProprietaire: { type: String, required: true },
  commune: { type: String, required: true },
  rue: { type: String, required: true },
  codePostal: { type: String, required: true },
  nombreCouchages: { type: Number, required: true },
  nombreChambres: { type: Number, required: true },
  distanceCentreVille: { type: Number, required: true },
  prix: { type: Number, required: true },
  imageUrl:{ type: String, required: false},
  avis: [avisSchema], // Tableau d'avis
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('Bien', bienSchema);
