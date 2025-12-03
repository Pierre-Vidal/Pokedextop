import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPokemon } from './list-pokemon';

describe('ListPokemon', () => {
  let component: ListPokemon;
  let fixture: ComponentFixture<ListPokemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPokemon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPokemon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
