// src/app/components/edit-property/edit-property.component.ts

import { Component, OnInit } from '@angular/core';
import { BienService } from '../../services/bien.service';
import { Bien } from '../../models/bien.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditPropertyComponent implements OnInit {
  bien: Bien | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bienService: BienService
  ) { }

  ngOnInit(): void {
    const bienId = this.route.snapshot.paramMap.get('id');
    console.log(`ID reçu pour modification: ${bienId}`);

    if (bienId) {
      this.loadBien(bienId);
    } else {
      this.errorMessage = 'ID du bien manquant.';
    }
  }

  loadBien(id: string): void {
    console.log(`Chargement du bien avec ID: ${id}`);
    this.bienService.getBienById(id).subscribe({
      next: (data) => {
        console.log('Bien récupéré:', data);
        this.bien = data;
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger le bien.';
        console.error('Erreur lors de la récupération du bien:', err);
      }
    });
  }

  updateBien(form: NgForm): void {
    if (form.invalid || !this.bien) {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      console.log('Formulaire invalide ou bien non chargé.');
      return;
    }

    console.log('Mise à jour du bien:', this.bien);
    this.bienService.updateBien(this.bien._id, this.bien).subscribe({
      next: (data) => {
        console.log('Bien mis à jour:', data);
        this.successMessage = 'Bien mis à jour avec succès.';
        this.router.navigate(['/biens']);
      },
      error: (err) => {
        // Vérifier si l'erreur est due à un manque de permissions
        if (err.status === 403) {
          this.errorMessage = "Vous n'avez pas le droit de modifier ce bien.";
        } else {
          this.errorMessage = 'Impossible de mettre à jour le bien.';
        }
        console.error('Erreur lors de la mise à jour du bien:', err);
      }
    });
  }

  cancel(): void {
    console.log('Annulation de l\'opération, navigation vers la liste des biens.');
    this.router.navigate(['/biens']);
  }
}

