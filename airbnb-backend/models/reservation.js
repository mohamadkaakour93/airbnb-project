// models/reservation.js

const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  bien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bien',
    required: true
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  statut: {
    type: String,
    enum: ['en attente', 'confirmée', 'annulée'],
    default: 'en attente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
