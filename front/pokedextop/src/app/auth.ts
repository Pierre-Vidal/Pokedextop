import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { JwtHelper } from './jwt.helper';

export interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSignal = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('currentUser');

    if (token && userJson) {
      // Vérifier si le token est expiré
      if (!JwtHelper.isTokenExpired(token)) {
        this.currentUserSignal.set(JSON.parse(userJson));
      } else {
        // Token expiré, nettoyer le storage
        this.logout();
      }
    }
  }

  login(username: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
        }

        const user = users[0];
        if (user.password !== password) {
          throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
        }

        // Générer un faux JWT
        const token = JwtHelper.generateToken(user.id, user.username);

        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
        return user;
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Erreur lors de la connexion'));
      })
    );
  }

  register(username: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
      tap(users => {
        if (users.length > 0) {
          throw new Error('Ce nom d\'utilisateur est déjà utilisé');
        }
      }),
      switchMap(() => {
        const newUser = { username, password };
        return this.http.post<User>(this.apiUrl, newUser);
      }),
      tap(createdUser => {
        // Générer un faux JWT
        const token = JwtHelper.generateToken(createdUser.id, createdUser.username);

        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(createdUser));
        this.currentUserSignal.set(createdUser);
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Erreur lors de l\'inscription'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return this.currentUserSignal() !== null && !JwtHelper.isTokenExpired(token);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get isAuthenticated$() {
    return this.currentUserSignal;
  }

  // PUT - Modifier tout le profil utilisateur
  updateUserProfile(userId: number, username: string, password: string): Observable<User> {
    const updatedUser: User = {
      id: userId,
      username: username,
      password: password
    };

    return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedUser).pipe(
      tap(user => {
        // Générer un nouveau token avec le nouveau username
        const token = JwtHelper.generateToken(user.id, user.username);
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
      }),
      catchError(error => {
        return throwError(() => new Error('Erreur lors de la mise à jour du profil'));
      })
    );
  }

  // PATCH - Modifier uniquement le username
  updateUsername(userId: number, newUsername: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, { username: newUsername }).pipe(
      tap(user => {
        // Générer un nouveau token avec le nouveau username
        const token = JwtHelper.generateToken(user.id, user.username);
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
      }),
      catchError(error => {
        return throwError(() => new Error('Erreur lors de la mise à jour du nom d\'utilisateur'));
      })
    );
  }

  // PATCH - Modifier uniquement le mot de passe
  updatePassword(userId: number, newPassword: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, { password: newPassword }).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
      }),
      catchError(error => {
        return throwError(() => new Error('Erreur lors de la mise à jour du mot de passe'));
      })
    );
  }
}
