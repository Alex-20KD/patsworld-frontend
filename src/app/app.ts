import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PetListComponent } from './features/pet-list/pet-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PetListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
}
