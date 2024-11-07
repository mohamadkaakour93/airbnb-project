// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importer AuthService et User

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Pour les opérations authentifiées
  private authUrl = 'http://localhost:3000/api/auth'; // Pour l'inscription et la connexion

  constructor(private http: HttpClient, private authService: AuthService) {} // Injecter AuthService

  // Méthode pour l'inscription (sans en-têtes d'authentification)
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, userData);
  }

  // Méthodes pour les opérations nécessitant une authentification
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Utiliser AuthService pour obtenir le token
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  getUserRole(): 'user' | 'loueur' | null { // Utiliser AuthService pour obtenir le rôle
    return this.authService.getUserRole();
  }

  isLoueur(): boolean { // Méthode pour vérifier si l'utilisateur est loueur
    return this.getUserRole() === 'loueur';
  }

  isUser(): boolean { // Méthode pour vérifier si l'utilisateur est un utilisateur régulier
    return this.getUserRole() === 'user';
  }
}
