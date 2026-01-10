import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', Validators.required],
  });

  submitting = false;
  error?: string;

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = undefined;
    const { fullName, email, phone, password } = this.form.value;
    this.auth
      .register({
        fullName: fullName ?? '',
        email: email ?? '',
        phone: phone ?? '',
        password: password ?? '',
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err) => {
          this.error = err?.error?.message ?? 'Error al registrarse';
          this.submitting = false;
        },
      });
  }
}
