// src/app/models/reservation.model.ts

import { Bien } from './bien.model';
import { User } from './user.model';

export interface Reservation {
  _id: string;
  bien: Bien;
  utilisateur: User; // ID de l'utilisateur
  dateDebut: Date;
  dateFin: Date;
  statut: 'en attente' | 'confirmée' | 'annulée';
  createdAt?: Date;
  updatedAt?: Date;
}
