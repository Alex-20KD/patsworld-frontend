import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  success?: string;
  error?: string;

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: [''], // optional new password
  });

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.form.patchValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? '',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = undefined;
    this.success = undefined;

    const payload = {
      fullName: this.form.value.fullName ?? '',
      email: this.form.value.email ?? '',
      phone: this.form.value.phone ?? '',
      password: this.form.value.password ?? '',
    };

    this.auth.updateProfile(payload).subscribe({
      next: (user) => {
        this.success = 'Perfil actualizado';
        this.submitting = false;
        this.auth.refreshUser(user);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo actualizar el perfil';
        this.submitting = false;
      },
    });
  }
}
