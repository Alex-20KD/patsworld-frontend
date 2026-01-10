import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

interface AuthResponse {
  message: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';
  private readonly storageKey = 'patsworld:user';
  private userSubject = new BehaviorSubject<User | null>(this.readStoredUser());

  user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private setUser(user: User | null): void {
    this.userSubject.next(user);
    if (user) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((resp) => this.setUser(resp.user)),
    );
  }

  register(payload: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role?: 'admin' | 'user';
  }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, payload).pipe(
      tap((user) => this.setUser(user)),
    );
  }

  logout(): void {
    this.setUser(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
