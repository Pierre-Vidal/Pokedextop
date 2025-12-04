import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, User } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentUser: User | null = null;

  // Formulaire unique
  form = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  // Messages de feedback
  successMessage = '';
  errorMessage = '';

  // État de chargement
  isLoading = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.form.username = this.currentUser.username;
    }
  }

  // Formulaire intelligent qui détecte PUT ou PATCH
  updateProfile(): void {
    this.clearMessages();

    if (!this.currentUser) return;

    const usernameChanged = this.form.username.trim() !== this.currentUser.username;
    const passwordFilled = this.form.password.trim().length > 0;

    // Déterminer quelle méthode utiliser
    if (usernameChanged && passwordFilled) {
      // PUT - Les deux champs sont modifiés
      this.performPutUpdate();
    } else if (usernameChanged && !passwordFilled) {
      // PATCH - Uniquement le username
      this.performPatchUsername();
    } else if (!usernameChanged && passwordFilled) {
      // PATCH - Uniquement le mot de passe
      this.performPatchPassword();
    } else {
      this.errorMessage = 'Aucune modification détectée';
    }
  }

  // PUT - Modifier tout le profil
  private performPutUpdate(): void {
    // Validation
    if (!this.form.username.trim()) {
      this.errorMessage = 'Le nom d\'utilisateur est requis';
      return;
    }

    if (this.form.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.currentUser) return;

    this.isLoading = true;

    this.authService.updateUserProfile(
      this.currentUser.id,
      this.form.username,
      this.form.password
    ).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Profil mis à jour avec succès';
        this.currentUser = updatedUser;
        this.form.username = updatedUser.username;
        this.form.password = '';
        this.form.confirmPassword = '';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
      }
    });
  }

  // PATCH - Modifier uniquement le username
  private performPatchUsername(): void {
    if (!this.form.username.trim()) {
      this.errorMessage = 'Le nom d\'utilisateur est requis';
      return;
    }

    if (!this.currentUser) return;

    this.isLoading = true;

    this.authService.updateUsername(
      this.currentUser.id,
      this.form.username
    ).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Nom d\'utilisateur mis à jour avec succès';
        this.currentUser = updatedUser;
        this.form.username = updatedUser.username;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la mise à jour du nom d\'utilisateur';
        this.isLoading = false;
      }
    });
  }

  // PATCH - Modifier uniquement le mot de passe
  private performPatchPassword(): void {
    if (this.form.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.currentUser) return;

    this.isLoading = true;

    this.authService.updatePassword(
      this.currentUser.id,
      this.form.password
    ).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Mot de passe mis à jour avec succès';
        this.currentUser = updatedUser;
        this.form.password = '';
        this.form.confirmPassword = '';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la mise à jour du mot de passe';
        this.isLoading = false;
      }
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
