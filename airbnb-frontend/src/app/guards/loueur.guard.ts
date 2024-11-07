// src/app/guards/loueur.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoueurGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.isLoueur()) {
      return true;
    } else {
      this.router.navigate(['/']); // Rediriger vers la page d'accueil ou une page d'erreur
      return false;
    }
  }
}
