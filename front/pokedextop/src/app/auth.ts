import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';

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
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSignal.set(JSON.parse(userJson));
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
        localStorage.setItem('currentUser', JSON.stringify(createdUser));
        this.currentUserSignal.set(createdUser);
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Erreur lors de l\'inscription'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  get isAuthenticated$() {
    return this.currentUserSignal;
  }
}
