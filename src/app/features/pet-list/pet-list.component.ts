import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.model';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];

  constructor(
    private petService: PetService,
    private cd: ChangeDetectorRef // <--- 2. INYECTARLO AQUÍ
  ) {}

  ngOnInit(): void {
    console.log('Iniciando petición...');
    this.petService.getPets().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.pets = data;

        // <--- 3. EL TRUCO DE MAGIA: Forzar la actualización
        this.cd.detectChanges();
      },
      error: (error) => console.error('Error:', error)
    });
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/400x400?text=Gatito+no+encontrado';
  }
}
