// src/app/services/reservation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMesReservations(): Observable<{ reservations: Reservation[] }> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    return this.http.get<{ reservations: Reservation[] }>(
      `${this.apiUrl}/mes-reservations`,
      { headers }
    );
  }

  getLoueurReservations(): Observable<{ reservations: Reservation[] }> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ reservations: Reservation[] }>(`${this.apiUrl}/reservations-loueur`, { headers });
  }

  createReservation(data: {
    bienId: string;
    dateDebut: string;
    dateFin: string;
  }): Observable<any> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    return this.http.post(`${this.apiUrl}`, data, { headers });
  }

  accepterReservation(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}/accepter`, {}, { headers });
  }

  annulerReservation(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}/annuler`, {}, { headers });
  }
  


}
