// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';


interface User {
  _id: string; // Changement de 'id' à '_id'
  email: string;
  prenom: string;
  nom: string;
  role: 'user' | 'loueur'; // Ajout du rôle
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    this.loadUser(); // Charger l'utilisateur au démarrage
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.loggedIn.next(true);
        this.currentUser = response.user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.currentUser = null;
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
  
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // En secondes
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserName(): string {
    if (this.currentUser) {
      return `${this.currentUser.prenom} ${this.currentUser.nom}`;
    }
    return 'Utilisateur';
  }

  getUserEmail(): string {
    return this.currentUser ? this.currentUser.email : '';
  }

  getUserId(): string {
    return this.currentUser ? this.currentUser._id : ''; 
  }

  getUserRole(): 'user' | 'loueur' | null { // Nouvelle méthode pour obtenir le rôle
    return this.currentUser ? this.currentUser.role : null;
  }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadUser();
      return true;
    }
    return false;
  }

  private loadUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }
  }
}
