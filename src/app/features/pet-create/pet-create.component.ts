import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PetService } from '../../core/services/pet.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pet-create.component.html',
  styleUrls: ['./pet-create.component.css'],
})
export class PetCreateComponent {
  private fb = inject(FormBuilder);
  private petService = inject(PetService);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  error?: string;
  selectedFile?: File;

  form = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    age: ['', Validators.required],
    description: ['', Validators.required],
    image: [null, Validators.required],
  });

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

    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      this.error = 'Completa todos los campos y selecciona una imagen.';
      return;
    }

    this.submitting = true;
    this.error = undefined;

    const currentUser = this.auth.currentUser;
    const formData = new FormData();
    formData.append('name', this.form.value.name ?? '');
    formData.append('breed', this.form.value.breed ?? '');
    formData.append('age', String(this.form.value.age ?? ''));
    formData.append('description', this.form.value.description ?? '');
    formData.append('ownerId', currentUser?.id ?? '');
    formData.append('image', this.selectedFile);

    this.petService.createPet(formData).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error al publicar la mascota';
        this.submitting = false;
      },
    });
  }
}
