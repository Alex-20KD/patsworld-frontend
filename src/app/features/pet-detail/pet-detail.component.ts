import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../core/models/pet.model';
import { PetService } from '../../core/services/pet.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.css'],
})
export class PetDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private petService = inject(PetService);
  private cd = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);
  private router = inject(Router);

  pet?: Pet;
  showForm = false;
  submitted = false;
  contactForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    message: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petService.getPetById(id).subscribe((pet) => {
        this.pet = pet;
        console.log('Datos del dueño:', pet?.user);
        this.cd.detectChanges();
      });
    }
  }

  toggleForm(): void {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.showForm = !this.showForm;
  }

  contactOwner(): void {
    if (!this.auth.isLoggedIn) {
      alert('Debes iniciar sesión para contactar al dueño');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.pet) {
      alert('No se encontró la mascota.');
      return;
    }

    const ownerPhone = this.pet.user?.phone ?? null;
    if (!ownerPhone) {
      alert('El dueño no tiene teléfono registrado');
      return;
    }

    const digitsOnly = ownerPhone.replace(/\D/g, '');

    let sanitizedPhone = digitsOnly;
    if (/^09\d{8}$/.test(digitsOnly)) {
      sanitizedPhone = `593${digitsOnly.slice(1)}`;
    }

    if (sanitizedPhone.length < 9) {
      alert('Número de teléfono inválido');
      return;
    }

    const message = encodeURIComponent(`Hola, estoy interesado en adoptar a ${this.pet.name}.`);

    const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  onSubmit(): void {
    if (!this.pet) {
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const fullName = this.contactForm.value.fullName ?? '';
    const phone = this.contactForm.value.phone ?? '';
    const message = this.contactForm.value.message ?? '';

    const ownerPhone = this.pet.ownerPhone ?? '';

    const sanitizedPhone = ownerPhone.replace(/[\s-]/g, '');

    if (!sanitizedPhone) {
      alert('No hay un número de contacto disponible.');
      return;
    }

    const text = encodeURIComponent(
      `Hola, me llamo ${fullName} y estoy interesado en adoptar a ${this.pet.name}. Mi teléfono es ${phone}. ${message}`.trim(),
    );

    const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${text}`;

    window.open(whatsappUrl, '_blank');
    this.submitted = true;
  }
}
