// src/app/components/property-detail/property-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { BienService } from '../../services/bien.service';
import { Bien, Avis } from '../../models/bien.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import dayjs from 'dayjs';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { Reservation } from '../../models/reservation.model';
import { AuthService } from '../../services/auth.service';

import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs avec les plugins
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDaterangepickerMd],
})
export class PropertyDetailComponent implements OnInit {
  bien: Bien | null = null;
  errorMessage: string = '';
  avisForm: Avis = {
    note: 5,
    commentaire: '',
    date: new Date(),
    utilisateur: '',
  };

  reservationDates: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } = {
    startDate: dayjs(),
    endDate: dayjs().add(1, 'day'),
  };

  minDate: dayjs.Dayjs = dayjs();

  reservationErrorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bienService: BienService,
    public userService: UserService,
    private reservationService: ReservationService,
    public authService: AuthService // Injecté AuthService pour obtenir l'ID utilisateur
  ) {}

  ngOnInit(): void {
    const bienId = this.route.snapshot.paramMap.get('id'); // Assurez-vous que le paramètre est 'id'
    console.log(`ID reçu depuis la route: ${bienId}`);

    if (bienId) {
      this.loadBien(bienId);
    } else {
      this.errorMessage = 'ID du bien manquant.';
      console.error('ID du bien manquant dans la route.');
    }

    // Définir l'ID de l'utilisateur connecté
    const userId = this.authService.getUserId(); // Implémentez cette méthode dans AuthService
    if (userId) {
      this.avisForm.utilisateur= userId;
      console.log(`Utilisateur connecté: ${userId}`);
    } else {
      this.errorMessage = 'Utilisateur non authentifié.';
      console.error('Utilisateur non authentifié.');
    }
  }

  loadBien(id: string): void {
    console.log(`Chargement du bien avec ID: ${id}`);
    this.bienService.getBienById(id).subscribe({
      next: (data) => {
        console.log('Bien récupéré:', data);
        this.bien = data; // Assignez directement l'objet Bien
        if (!this.bien.avis) {
          this.bien.avis = [];
        }
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger le bien.';
        console.error('Erreur lors de la récupération du bien:', err);
      },
    });
  }

  submitAvis(): void {
    console.log('Tentative de soumission d\'avis');

    if (!this.bien) {
      this.errorMessage = 'Bien non chargé.';
      console.error('Tentative de soumission d\'avis sans bien chargé.');
      return;
    }

    // Validation supplémentaire côté frontend
    if (this.avisForm.note < 1 || this.avisForm.note > 5) {
      this.errorMessage = 'La note doit être entre 1 et 5.';
      console.error('Note invalide:', this.avisForm.note);
      return;
    }

    if (!this.avisForm.commentaire.trim()) {
      this.errorMessage = 'Le commentaire est requis.';
      console.error('Commentaire vide.');
      return;
    }

    console.log('Soumission de l\'avis avec les données:', this.avisForm);
    this.bienService.addAvis(this.bien._id, this.avisForm).subscribe({
      next: (res) => {
        this.errorMessage = '';
        if (!this.bien!.avis) {
          this.bien!.avis = [];
        }
        this.bien!.avis.push(res);
        this.avisForm = {
          note: 5,
          commentaire: '',
          date: new Date(),
          utilisateur: this.authService.getUserName() || '',
        };
        console.log('Avis ajouté avec succès:', res);
      },
      error: (err) => {
        this.errorMessage = 'Impossible d\'ajouter l\'avis.';
        console.error('Erreur lors de l\'ajout de l\'avis:', err);
      },
    });
  }

  // Méthode corrigée pour naviguer vers la page de réservation
  reserveBien(id: string): void {
    console.log(`Navigating to /biens/${id}/reserver/`);
    this.router.navigate(['/biens', id, 'reserver']); // Utiliser les segments du tableau
  }
}
