import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListPokemon } from "./list-pokemon/list-pokemon";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListPokemon, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pokedextop');
}
