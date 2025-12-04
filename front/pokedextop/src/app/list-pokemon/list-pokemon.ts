import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService, Pokemon } from '../pokemon-service';

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-pokemon.html',
  styleUrl: './list-pokemon.css',
})
export class ListPokemon implements OnInit {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  allPokemons: Pokemon[] = [];
  currentPage = 1;
  limit = 9;
  totalPokemons = 151;
  searchTerm = '';

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllPokemons();
  }

  loadAllPokemons(): void {
    this.pokemonService.getAllPokemons().subscribe({
      next: (data) => {
        console.log('Pokémons chargés:', data.length);
        this.allPokemons = data;
        this.totalPokemons = data.length;
        this.applyFiltersAndPagination();
        this.cdr.detectChanges();
        console.log('Pokémons affichés:', this.pokemons.length);
        console.log('Pokémons filtrés:', this.filteredPokemons.length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des Pokémons:', error);
      }
    });
  }

  applyFiltersAndPagination(): void {
    // Filtrer par recherche
    if (this.searchTerm.trim()) {
      this.filteredPokemons = this.allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pokemon.type.some(t => t.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      this.filteredPokemons = [...this.allPokemons];
    }

    // Calculer la pagination
    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;

    // Appliquer la pagination
    this.pokemons = this.filteredPokemons.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset à la page 1 lors d'une recherche
    this.applyFiltersAndPagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPokemons.length / this.limit);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getPageNumbers(): number[] {
    const maxPages = 5; // Nombre max de boutons de page à afficher
    const pages: number[] = [];

    if (this.totalPages <= maxPages) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    // Logique pour afficher les pages autour de la page actuelle
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, this.currentPage + 2);

    if (this.currentPage <= 3) {
      endPage = maxPages;
    } else if (this.currentPage >= this.totalPages - 2) {
      startPage = this.totalPages - maxPages + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
