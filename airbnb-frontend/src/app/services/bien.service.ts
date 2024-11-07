// src/app/services/bien.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Bien, BienCreation, Avis } from '../models/bien.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BienService {
  private apiUrl = 'http://localhost:3000/api/biens'; // Vérifiez l'URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBiens(): Observable<Bien[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Bien[]>(this.apiUrl, { headers });
  }
  
  getBienById(id: string): Observable<Bien> {
    const headers = this.getAuthHeaders();
    return this.http.get<Bien>(`${this.apiUrl}/${id}`, { headers });
  }

  addBien(bien: BienCreation): Observable<Bien> {
    const headers = this.getAuthHeaders();
    return this.http.post<Bien>(this.apiUrl, bien, { headers });
  }

  updateBien(id: string, bien: Partial<Bien>): Observable<Bien> {
    const headers = this.getAuthHeaders();
    return this.http.put<Bien>(`${this.apiUrl}/${id}`, bien, { headers });
  }

  addAvis(id: string, avis: Avis): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(`Ajout d'un avis pour le bien ID: ${id}`, avis);
    return this.http.post(`${this.apiUrl}/${id}/avis`, avis, { headers });
  }

  getBiensDuProprietaire(): Observable<Bien[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Bien[]>(`${this.apiUrl}/mes-biens`, { headers });
  }

  // Méthode pour obtenir les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getFilteredBiens(location: string, dateDebut: string, dateFin: string): Observable<Bien[]> {
    let params = new HttpParams();
    if (location) params = params.set('location', location);
    if (dateDebut) params = params.set('dateDebut', dateDebut);
    if (dateFin) params = params.set('dateFin', dateFin);

    return this.http.get<Bien[]>(`${this.apiUrl}/filter`, { params });
  }
}
