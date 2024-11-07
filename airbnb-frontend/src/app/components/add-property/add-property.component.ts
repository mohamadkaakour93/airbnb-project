// src/app/components/add-property/add-property.component.ts

import { Component } from '@angular/core';
import { BienService } from '../../services/bien.service';
import { BienCreation } from '../../models/bien.model';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddPropertyComponent {
  bienCreation: BienCreation = {
    emailProprietaire: '',
    commune: '',
    rue: '',
    codePostal: '',
    nombreCouchages: 0,
    nombreChambres: 0,
    distanceCentreVille: 0,
    prix: 0,
    imageUrl: ''
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private bienService: BienService,
    private router: Router
  ) { }

  saveBien(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      console.log('Formulaire invalide.');
      return;
    }

    console.log('Ajout d\'un nouveau bien avec les données:', this.bienCreation);
    this.bienService.addBien(this.bienCreation).subscribe({
      next: (data) => {
        console.log('Bien ajouté avec succès:', data);
        this.successMessage = 'Bien ajouté avec succès.';
        form.resetForm();
        this.router.navigate(['/biens']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Impossible d\'ajouter le bien.';
        console.error('Erreur lors de l\'ajout du bien:', err);
      }
    });
  }

  cancel(): void {
    console.log('Annulation de l\'opération, navigation vers la liste des biens.');
    this.router.navigate(['/biens']);
  }
}
