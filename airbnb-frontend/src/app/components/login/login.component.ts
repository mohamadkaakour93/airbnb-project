import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Méthode de connexion
  login(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      this.successMessage = '';
      return;
    }

    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Connexion réussie', response);
        // Stocker le token JWT
        localStorage.setItem('token', response.token);
        this.successMessage = 'Connexion réussie !';
        this.errorMessage = '';
        form.resetForm();
        // Rediriger vers une page protégée ou la liste des utilisateurs
        this.router.navigate(['/users']);
      },
      error => {
        console.error('Erreur lors de la connexion', error);
        this.errorMessage = error.error.message || 'Identifiants invalides.';
        this.successMessage = '';
      }
    );
  }
}

