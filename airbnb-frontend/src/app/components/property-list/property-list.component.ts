// src/app/components/property-list/property-list.component.ts

import { Component, OnInit } from '@angular/core';
import { BienService } from '../../services/bien.service';
import { Bien } from '../../models/bien.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss'],
  standalone: true,
  imports: [CommonModule, SearchBarComponent]
})
export class PropertyListComponent implements OnInit {
  biens: Bien[] = [];
  isLoueur: boolean = false;
  errorMessage: string = '';

  constructor(
    private bienService: BienService,
    private router: Router,
    private userService: UserService,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
    if (this.userService.isLoueur()) {
      this.loadBiensDuProprietaire();
    } else {
      this.loadTousLesBiens();
    }
  }

  loadBiensDuProprietaire(): void {
    this.bienService.getBiensDuProprietaire().subscribe({
      next: (data) => {
        this.biens = data;
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger les biens du propriétaire.';
        console.error('Erreur lors de la récupération des biens du propriétaire:', err);
      }
    });
  }

  loadTousLesBiens(): void {
    this.bienService.getBiens().subscribe({
      next: (data) => {
        this.biens = data;
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger la liste des biens.';
        console.error('Erreur lors de la récupération des biens:', err);
      }
    });
  }

  viewBien(id: string): void {
    console.log(`Navigating to /biens/${id}`);
    this.router.navigate(['/biens', id]);
  }

  addBien(): void {
    console.log('Navigating to /ajouter-bien');
    this.router.navigate(['biens/add']);
  }

  editBien(id: string): void {
    console.log(`Navigating to /biens/edit/${id}`);
    this.router.navigate(['/biens/edit', id]);
  }
  reserveBien(id: string): void {
    console.log(`Navigating to /biens/${id}/reserver/`);
    this.router.navigate(['/biens', id, 'reserver']);
}

applyFilters(filters: any): void {
  const { location, dateDebut, dateFin } = filters;
  this.bienService.getFilteredBiens(location, dateDebut, dateFin).subscribe({
    next: (filteredData) => (this.biens = filteredData),
    error: (err) => console.error('Erreur lors de la récupération des biens filtrés:', err)
  });
}


}
