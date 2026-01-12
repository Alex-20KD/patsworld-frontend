import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetService } from '../../core/services/pet.service';
import { AuthService } from '../../core/services/auth.service';
import { Pet } from '../../core/models/pet.model';

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pet-create.component.html',
  styleUrls: ['./pet-create.component.css'],
})
export class PetCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private petService = inject(PetService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  petId?: string;

  submitting = false;
  error?: string;
  success?: string;
  selectedFile?: File;

  form = this.fb.group({
    name: ['', Validators.required],
    species: ['', Validators.required],
    breed: ['', Validators.required],
    age: ['', Validators.required],
    description: ['', Validators.required],
    image: [null, Validators.required],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.petId = id;
        const imageControl = this.form.get('image');
        imageControl?.clearValidators();
        imageControl?.updateValueAndValidity();
        this.loadPet(id);
      }
    });
  }

  private loadPet(id: string): void {
    this.petService.getPetById(id).subscribe({
      next: (pet: Pet) => {
        this.form.patchValue({
          name: pet.name,
          species: pet.species ?? '',
          breed: pet.breed,
          age: pet.age !== undefined && pet.age !== null ? String(pet.age) : '',
          description: pet.description,
        });
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo cargar la mascota';
      },
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.form.patchValue({ image: file as any });
    }
  }

  onSubmit(): void {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    const needsImage = !this.isEditMode;

    if (this.form.invalid || (needsImage && !this.selectedFile)) {
      this.form.markAllAsTouched();
      this.error = 'Completa todos los campos y selecciona una imagen.';
      return;
    }

    this.submitting = true;
    this.error = undefined;
    this.success = undefined;

    const currentUser = this.auth.currentUser;
    const formData = new FormData();
    if (!this.isEditMode) {
      formData.append('name', this.form.get('name')?.value ?? '');
      formData.append('species', this.form.get('species')?.value ?? '');
      formData.append('breed', this.form.get('breed')?.value ?? '');
      formData.append('age', String(this.form.get('age')?.value ?? ''));
      formData.append('description', this.form.get('description')?.value ?? '');
      formData.append('ownerId', currentUser?.id ?? '');
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.petService.createPet(formData).subscribe({
        next: () => {
          this.submitting = false;
          this.success = '¡Mascota enviada! Un administrador revisará tu publicación pronto';
          this.form.reset();
          this.selectedFile = undefined;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error al publicar la mascota';
          this.submitting = false;
        },
      });
    } else if (this.petId) {
      const payload: Partial<Pet> = {
        name: this.form.get('name')?.value ?? '',
        species: this.form.get('species')?.value ?? '',
        breed: this.form.get('breed')?.value ?? '',
        age: Number(this.form.get('age')?.value ?? 0),
        description: this.form.get('description')?.value ?? '',
      };

      this.petService.updatePet(this.petId, payload, currentUser?.id ?? '').subscribe({
        next: () => {
          this.submitting = false;
          this.success = 'Cambios guardados';
          this.router.navigate(['/my-pets']);
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error al guardar la mascota';
          this.submitting = false;
        },
      });
    }
  }
}
