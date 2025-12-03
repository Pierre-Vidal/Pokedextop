import { Routes } from '@angular/router';
import { Login } from './login/login.js';
import { Pokedex } from './pokedex/pokedex.js';
import { Pokemon } from './pokemon/pokemon.js';
import { ListPokemon } from './list-pokemon/list-pokemon.js';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'pokedex', component: Pokedex},
    {path: 'pokemon', component: Pokemon},
    {path: 'list-pokemon', component: ListPokemon},

    {path : '', redirectTo: 'pokemon', pathMatch: 'full'},
];
