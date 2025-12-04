import { Component } from '@angular/core';
import { ListPokemon } from '../list-pokemon/list-pokemon';

@Component({
  selector: 'app-pokemon',
  imports: [ListPokemon],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.css',
})
export class Pokemon {

}
