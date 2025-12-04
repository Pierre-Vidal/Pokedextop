import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Auth } from './auth';

export interface UserPokemon {
  id?: number;
  userId: number;
  pokemonId: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserPokemonService {
  private apiUrl = 'http://localhost:3000/userPokemons';
  private userPokemonsSubject = new BehaviorSubject<number[]>([]);
  public userPokemons$ = this.userPokemonsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: Auth
  ) {
    this.loadUserPokemons();
  }

  private loadUserPokemons(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.getUserPokemons(user.id).subscribe(pokemonIds => {
        this.userPokemonsSubject.next(pokemonIds);
      });
    }
  }

  getUserPokemons(userId: number): Observable<number[]> {
    return this.http.get<UserPokemon[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      map(userPokemons => userPokemons.map(up => up.pokemonId))
    );
  }

  hasPokemon(pokemonId: number): boolean {
    return this.userPokemonsSubject.value.includes(pokemonId);
  }

  addPokemon(pokemonId: number): Observable<UserPokemon> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userPokemon: UserPokemon = {
      userId: user.id,
      pokemonId: pokemonId
    };

    return this.http.post<UserPokemon>(this.apiUrl, userPokemon).pipe(
      tap(() => {
        const current = this.userPokemonsSubject.value;
        this.userPokemonsSubject.next([...current, pokemonId]);
      })
    );
  }

  removePokemon(pokemonId: number): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    return this.http.get<UserPokemon[]>(`${this.apiUrl}?userId=${user.id}&pokemonId=${pokemonId}`).pipe(
      map(userPokemons => userPokemons[0]),
      switchMap(userPokemon => {
        if (userPokemon && userPokemon.id) {
          return this.http.delete<void>(`${this.apiUrl}/${userPokemon.id}`);
        }
        throw new Error('Pokemon not found in collection');
      }),
      tap(() => {
        const current = this.userPokemonsSubject.value;
        this.userPokemonsSubject.next(current.filter(id => id !== pokemonId));
      })
    );
  }

  togglePokemon(pokemonId: number): Observable<any> {
    if (this.hasPokemon(pokemonId)) {
      return this.removePokemon(pokemonId);
    } else {
      return this.addPokemon(pokemonId);
    }
  }

  refreshUserPokemons(): void {
    this.loadUserPokemons();
  }
}
