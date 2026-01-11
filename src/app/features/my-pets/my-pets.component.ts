import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-pets.component.html',
})
export class MyPetsComponent implements OnInit {
  pets: Pet[] = [];
  loading = true;
  error?: string;

  constructor(
    private petService: PetService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) {
      this.loading = false;
      this.error = 'Debes iniciar sesión para ver tus mascotas.';
      return;
    }

    this.petService.getPets().subscribe({
      next: (data) => {
        this.pets = data.filter((pet) => pet.ownerId === user.id);
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error al cargar tus mascotas';
        this.loading = false;
      },
    });
  }

  markAdopted(pet: Pet): void {
    const user = this.auth.currentUser;
    if (!user) return;

    this.petService.updatePet(pet.id, { isAdopted: true }, user.id).subscribe({
      next: (updated) => {
        this.pets = this.pets.map((p) => (p.id === updated.id ? updated : p));
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo actualizar la mascota';
      },
    });
  }

  deletePet(pet: Pet): void {
    const user = this.auth.currentUser;
    if (!user) return;

    const confirmDelete = confirm(`¿Eliminar a ${pet.name}?`);
    if (!confirmDelete) return;

    this.petService.deletePet(pet.id, user.id).subscribe({
      next: () => {
        this.pets = this.pets.filter((p) => p.id !== pet.id);
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo eliminar la mascota';
      },
    });
  }
}
