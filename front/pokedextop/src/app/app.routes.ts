import { Routes } from '@angular/router';
import { Login } from './login/login.js';
import { Pokedex } from './pokedex/pokedex.js';
import { Pokemon } from './pokemon/pokemon.js';
import { ListPokemon } from './list-pokemon/list-pokemon.js';
import { Home } from './home/home.js';
import { authGuard } from './auth-guard.js';

export const routes: Routes = [
    {path: 'home', component: Home},
    {path: 'login', component: Login},
    {path: 'pokedex', component: Pokedex, canActivate: [authGuard]},
    {path: 'pokemon', component: Pokemon, canActivate: [authGuard]},
    {path: 'list-pokemon', component: ListPokemon, canActivate: [authGuard]},

    {path : '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', redirectTo: '/home'},
];
