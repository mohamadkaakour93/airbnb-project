import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  errorMessage: string = '';
  pollingSubscription!: Subscription; // Subscription pour le polling

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    // Définir un intervalle pour mettre à jour les réservations toutes les 5 secondes
    this.pollingSubscription = interval(5000) // 5000 ms = 5 secondes
      .pipe(switchMap(() => this.reservationService.getMesReservations()))
      .subscribe({
        next: (res) => {
          this.reservations = res.reservations.map((reservation) => ({
            ...reservation,
            dateDebut: new Date(reservation.dateDebut),
            dateFin: new Date(reservation.dateFin),
          }));
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la récupération des réservations.';
          console.error('Erreur lors de la récupération des réservations:', err);
        }
      });
  }

  ngOnDestroy(): void {
    // Désabonnez-vous pour éviter les fuites de mémoire
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
