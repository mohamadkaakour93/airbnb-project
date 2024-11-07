// src/app/components/reservation/reservation.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { BienService } from '../../services/bien.service';
import { Bien } from '../../models/bien.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ReservationComponent implements OnInit {
  bienId: string = '';
  bien: Bien | null = null;
  dateDebut: string = '';
  dateFin: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private bienService: BienService,
    private authService: AuthService // Injecté AuthService si nécessaire
  ) {}

  ngOnInit(): void {
    this.bienId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bienId) {
      this.loadBien();
    } else {
      this.errorMessage = 'ID du bien manquant.';
      console.error('ID du bien manquant dans la route.');
    }
  }

  loadBien(): void {
    this.bienService.getBienById(this.bienId).subscribe({
      next: (res) => {
        this.bien = res;
        if (!this.bien) {
          this.errorMessage = 'Bien non trouvé.';
          console.error('Bien non trouvé avec l\'ID:', this.bienId);
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du bien.';
        console.error('Erreur lors du chargement du bien:', err);
      },
    });
  }

  submitReservation(): void {
    if (!this.dateDebut || !this.dateFin) {
      this.errorMessage = 'Veuillez sélectionner les dates de réservation.';
      return;
    }
  
    const debut = new Date(this.dateDebut);
    const fin = new Date(this.dateFin);
    if (fin <= debut) {
      this.errorMessage = 'La date de fin doit être après la date de début.';
      return;
    }
  
    const reservationData = {
      bienId: this.bienId,
      dateDebut: debut.toISOString(),
      dateFin: fin.toISOString(),
    };
  
    this.reservationService.createReservation(reservationData).subscribe({
      next: (res) => {
        alert('Réservation effectuée avec succès !');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Capturez le message spécifique du backend si disponible
        this.errorMessage = err.error.message || 'Erreur lors de la réservation.';
        console.error('Erreur lors de la réservation:', this.errorMessage);
      },
    });
  }
}  