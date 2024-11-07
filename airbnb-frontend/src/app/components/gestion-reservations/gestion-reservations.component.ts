// src/app/components/gestion-reservations/gestion-reservations.component.ts

import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-reservations',
  templateUrl: './gestion-reservations.component.html',
  styleUrls: ['./gestion-reservations.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GestionReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getLoueurReservations().subscribe({
      next: (res) => {
        this.reservations = res.reservations;
        this.isLoading = false;
        console.log('Réservations chargées:', this.reservations);

        // Vérifiez chaque réservation
        this.reservations.forEach((reservation, index) => {
          console.log(`Réservation ${index + 1}:`);
          console.log(`Bien: ${reservation.bien?.commune} - ${reservation.bien?.rue}`);
          console.log(`Utilisateur: ${reservation.utilisateur?.prenom} ${reservation.utilisateur?.nom}`);
          console.log(`Dates: ${reservation.dateDebut} - ${reservation.dateFin}`);
          console.log(`Statut: ${reservation.statut}`);
        });
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger les réservations.';
        console.error('Erreur lors du chargement des réservations:', err);
        this.isLoading = false;
        alert(this.errorMessage);
      },
    });
  }

  accepter(id: string): void {
    console.log(`Tentative d'acceptation de la réservation avec ID: ${id}`);
    if (confirm('Êtes-vous sûr de vouloir accepter cette réservation ?')) {
      this.reservationService.accepterReservation(id).subscribe({
        next: (res) => {
          console.log('Réservation acceptée:', res);
          alert('Réservation acceptée avec succès.');
          this.loadReservations(); // Recharger les réservations pour refléter les changements
        },
        error: (err) => {
          this.errorMessage = 'Impossible d\'accepter la réservation.';
          console.error('Erreur lors de l\'acceptation de la réservation:', err);
          alert(this.errorMessage);
        },
      });
    }
  }

  annuler(id: string): void {
    console.log(`Tentative d'annulation de la réservation avec ID: ${id}`);
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.annulerReservation(id).subscribe({
        next: (res) => {
          console.log('Réservation annulée:', res);
          alert('Réservation annulée avec succès.');
          this.loadReservations(); // Recharger les réservations pour refléter les changements
        },
        error: (err) => {
          this.errorMessage = 'Impossible d\'annuler la réservation.';
          console.error('Erreur lors de l\'annulation de la réservation:', err);
          alert(this.errorMessage);
        },
      });
    }
  }
}