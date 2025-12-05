import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService, Pokemon } from '../pokemon-service';
import { UserPokemonService } from '../user-pokemon.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Auth } from '../auth';

type PokemonWithDescription = Pokemon & { description?: string };

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-pokemon.html',
  styleUrls: ['./list-pokemon.css'],
})
export class ListPokemon implements OnInit {
  pokemons: PokemonWithDescription[] = [];
  filteredPokemons: PokemonWithDescription[] = [];
  allPokemons: PokemonWithDescription[] = [];
  currentPage = 1;
  limit = 9;
  totalPokemons = 151;
  searchTerm = '';

  selectedPokemon: PokemonWithDescription | null = null;
  loadingToggle = new Set<number>(); // pour empêcher multiple clics rapides par id

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef,
    public userPokemonService: UserPokemonService,
    private router: Router,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadAllPokemons();

    // si tu veux que la vue se mette à jour automatiquement lorsque la collection change
    this.userPokemonService.userPokemons$.subscribe(() => {
      // simple detectChanges pour re-render des badges
      this.cdr.detectChanges();
    });
  }

  loadAllPokemons(): void {
    this.pokemonService.getAllPokemons().subscribe({
      next: (data: PokemonWithDescription[]) => {
        this.allPokemons = data;
        this.totalPokemons = data.length;
        this.applyFiltersAndPagination();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des Pokémons:', error);
      }
    });
  }

  applyFiltersAndPagination(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      this.filteredPokemons = this.allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(term) ||
        (pokemon.type && pokemon.type.some((t: string) => t.toLowerCase().includes(term)))
      );
    } else {
      this.filteredPokemons = [...this.allPokemons];
    }

    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.pokemons = this.filteredPokemons.slice(startIndex, endIndex);
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
    return Math.max(1, Math.ceil(this.filteredPokemons.length / this.limit));
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
    if (this.currentPage <= 3) endPage = maxPages;
    else if (this.currentPage >= this.totalPages - 2) startPage = this.totalPages - maxPages + 1;
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }

  hasPokemon(pokemonId: number): boolean {
    return this.userPokemonService.hasPokemon(pokemonId);
  }

  /**
   * Si l'utilisateur n'est pas connecté -> redirection vers login.
   * Sinon -> appel au service pour toggle l'ajout/suppression.
   */
  togglePokemon(pokemonId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // Si pas authentifié -> rediriger vers login
    if (!this.authService.isAuthenticated()) {
      // on peut passer un returnUrl pour revenir après connexion
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/list-pokemon' } });
      return;
    }

    if (this.loadingToggle.has(pokemonId)) {
      // évite les double-clics rapides
      return;
    }

    this.loadingToggle.add(pokemonId);

    // appel au service (il renvoie un Observable) — abonnement géré ici
    this.userPokemonService.togglePokemon(pokemonId).pipe(
      finalize(() => {
        this.loadingToggle.delete(pokemonId);
      })
    ).subscribe({
      next: (res) => {
        console.log('Pokémon toggled:', pokemonId, res);
        // le service met à jour le BehaviorSubject en interne ; on force la détection
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error toggling pokemon:', err);
        // Optionnel : affiche une erreur utilisateur (toast/snackbar)
      }
    });
  }

  openDetail(pokemon: PokemonWithDescription, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedPokemon = pokemon;
    this.cdr.detectChanges();
  }

  closeDetail(): void {
    this.selectedPokemon = null;
    this.cdr.detectChanges();
  }

  @HostListener('window:keydown', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.selectedPokemon) {
      this.closeDetail();
    }
  }
}
