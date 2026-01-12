import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submitting = false;
  error?: string;

  ngOnInit(): void {
    const saved = localStorage.getItem('saved_email');
    if (saved) {
      this.form.patchValue({ email: saved });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = undefined;
    const { email, password } = this.form.value;
    this.auth.login({ email: email ?? '', password: password ?? '' }).subscribe({
      next: () => {
        localStorage.setItem('saved_email', email ?? '');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error al iniciar sesión';
        this.submitting = false;
      },
    });
  }
}
