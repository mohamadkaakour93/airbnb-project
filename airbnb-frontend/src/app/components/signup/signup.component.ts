import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule

  ],
})
export class SignupComponent {
  user = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: ''
  };

  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  // Méthode d'inscription
  signup(form: NgForm) {
    if (form.invalid || this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir correctement le formulaire et vous assurer que les mots de passe correspondent.';
      this.successMessage = '';
      return;
    }

    this.userService.signup(this.user).subscribe(
      response => {
        console.log('Inscription réussie', response);
        // Stocker le token JWT si nécessaire
        localStorage.setItem('token', response.token);
        this.successMessage = 'Inscription réussie !';
        this.errorMessage = '';
        form.resetForm();
        // Rediriger l'utilisateur si nécessaire
        this.router.navigate(['/profile']);
      },
      error => {
        console.error('Erreur lors de l\'inscription', error);
        this.errorMessage = error.error.message || 'Une erreur est survenue lors de l\'inscription.';
        this.successMessage = '';
      }
    );
  }
}
