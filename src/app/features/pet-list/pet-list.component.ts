import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.model';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];

  selectedSpecies: string = '';
  searchBreed: string = '';
  searchAge?: number | null;
  isLoading = true;
  showFilters = false;

  constructor(
    private petService: PetService,
    private cd: ChangeDetectorRef // <--- 2. INYECTARLO AQUÍ
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading = true;
    this.petService
      .getPets({
        species: this.selectedSpecies || undefined,
        breed: this.searchBreed || undefined,
        age: this.searchAge === undefined || this.searchAge === null ? undefined : this.searchAge,
      })
      .subscribe({
        next: (data) => {
          this.pets = data;
          this.cd.detectChanges();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.isLoading = false;
        },
      });
  }


  onFilter(): void {
    this.loadPets();
  }

  resetFilters(): void {
    this.selectedSpecies = '';
    this.searchBreed = '';
    this.searchAge = undefined;
    this.loadPets();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg';
  }

  get availablePets(): Pet[] {
    return this.pets.filter((pet) => !pet.isAdopted);
  }
}
