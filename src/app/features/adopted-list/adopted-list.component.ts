import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.model';

@Component({
  selector: 'app-adopted-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adopted-list.component.html',
})
export class AdoptedListComponent implements OnInit {
  pets: Pet[] = [];

  constructor(private petService: PetService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.petService.getPets().subscribe({
      next: (data) => {
        this.pets = data.filter((pet) => pet.isAdopted);
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
}
