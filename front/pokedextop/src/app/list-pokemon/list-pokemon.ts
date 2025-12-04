import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService, Pokemon } from '../pokemon-service';

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-pokemon.html',
  styleUrl: './list-pokemon.css',
})
export class ListPokemon implements OnInit {
  pokemons: Pokemon[] = [];
  currentPage = 1;
  limit = 9;
  totalPokemons = 151; // tu peux mettre dynamique si besoin
  totalPages = Math.ceil(this.totalPokemons / this.limit);

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.pokemonService.getPokemons(this.currentPage, this.limit).subscribe((data) => {
      this.pokemons = data;
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPokemons();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
