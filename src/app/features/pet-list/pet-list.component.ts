import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Pet } from '../../core/models/pet.model';
import { PetService } from '../../core/services/pet.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css',
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];

  constructor(private readonly petService: PetService) {}

  ngOnInit(): void {
    this.petService.getPets().subscribe((pets) => {
      this.pets = pets;
    });
  }
}
