import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected isLoginMode = signal(true);

  // Login form
  loginUsername = '';
  loginPassword = '';

  // Register form
  registerUsername = '';
  registerPassword = '';
  confirmPassword = '';

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onLogin(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.loginUsername || !this.loginPassword) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    this.authService.login(this.loginUsername, this.loginPassword).subscribe({
      next: () => {
        this.successMessage.set('Connexion réussie !');
        setTimeout(() => {
          this.router.navigate(['/pokemon']);
        }, 500);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
      }
    });
  }

  onRegister(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.registerUsername || !this.registerPassword || !this.confirmPassword) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    if (this.registerPassword !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    this.authService.register(this.registerUsername, this.registerPassword).subscribe({
      next: () => {
        this.successMessage.set('Inscription réussie !');
        setTimeout(() => {
          this.router.navigate(['/pokemon']);
        }, 500);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
      }
    });
  }
}
