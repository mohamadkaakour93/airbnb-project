// src/app/routes/app.routes.ts

import { Route } from '@angular/router';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './services/auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { AddPropertyComponent } from './components/add-property/add-property.component';
import { EditPropertyComponent } from './components/edit-property/edit-property.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { GestionReservationsComponent } from './components/gestion-reservations/gestion-reservations.component';
import { LoueurGuard } from './guards/loueur.guard';
export const routes: Route[] = [
  { path: 'biens', component: PropertyListComponent, canActivate: [AuthGuard] },
  { path: 'mes-biens', component: PropertyListComponent, canActivate: [AuthGuard] },
  { path: 'biens/add', component: AddPropertyComponent, canActivate:[LoueurGuard] },
  { path: 'biens/:id', component: PropertyDetailComponent, canActivate: [AuthGuard] },
  { path: 'biens/edit/:id', component: EditPropertyComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'biens/:id/reserver', component: ReservationComponent,  canActivate: [AuthGuard]},
  { path: 'gestion-reservations', component: GestionReservationsComponent, canActivate: [AuthGuard ,LoueurGuard] },
  
  
  
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/biens', pathMatch: 'full' },
  { path: '**', redirectTo: '/biens' }
];

