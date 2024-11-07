// src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/nav-bar/navbar.component';
import { ReservationComponent } from "./components/reservation/reservation.component";
import { SearchBarComponent } from './search-bar/search-bar.component';
import { Router } from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, ReservationComponent,SearchBarComponent]
})
export class AppComponent { 
  
  constructor(private router: Router) {}

  onSearch(filters: any): void {
    // Naviguer vers la page de résultats de recherche et passer les filtres comme état
    this.router.navigate(['/properties'], { queryParams: filters });
  }
}
