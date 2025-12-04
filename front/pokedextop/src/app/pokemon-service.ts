import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  id: number;
  name: string;
  type: string[];
  image: string;
  height: number;
  weight: number;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'http://localhost:3000/pokemons';

  constructor(private http: HttpClient) {}

  getPokemons(page: number, limit: number): Observable<Pokemon[]> {
    const params = new HttpParams()
      .set('_page', page)
      .set('_limit', limit);

    return this.http.get<Pokemon[]>(this.apiUrl, { params });
  }

  getAllPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl);
  }
}
