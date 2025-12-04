import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService, Pokemon } from '../pokemon-service';
import { UserPokemonService } from '../user-pokemon.service';

@Component({
  selector: 'app-pokedex',
  imports: [CommonModule, FormsModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex implements OnInit {
  myPokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  displayedPokemons: Pokemon[] = [];
  isLoading = true;
  searchTerm = '';
  currentPage = 1;
  limit = 9;

  constructor(
    private pokemonService: PokemonService,
    private userPokemonService: UserPokemonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyPokemons();
  }

  loadMyPokemons(): void {
    this.isLoading = true;

    // Récupérer tous les Pokémon
    this.pokemonService.getAllPokemons().subscribe({
      next: (allPokemons) => {
        // Filtrer pour ne garder que ceux de la collection
        this.userPokemonService.userPokemons$.subscribe(userPokemonIds => {
          this.myPokemons = allPokemons.filter(pokemon =>
            userPokemonIds.includes(+pokemon.id)
          );
          this.applyFiltersAndPagination();
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des Pokémon:', error);
        this.isLoading = false;
      }
    });
  }

  applyFiltersAndPagination(): void {
    // Filtrer par recherche
    if (this.searchTerm.trim()) {
      this.filteredPokemons = this.myPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pokemon.type.some(t => t.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      this.filteredPokemons = [...this.myPokemons];
    }

    // Calculer la pagination
    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;

    // Appliquer la pagination
    this.displayedPokemons = this.filteredPokemons.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1;
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
    const maxPages = 5;
    const pages: number[] = [];

    if (this.totalPages <= maxPages) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

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

  removePokemon(pokemonId: number): void {
    this.userPokemonService.removePokemon(pokemonId).subscribe({
      next: () => {
        this.myPokemons = this.myPokemons.filter(p => +p.id !== pokemonId);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }
}
