import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Pet } from '../models/pet.model';

export interface AdminStats {
  totalUsers: number;
  petsAvailable: number;
  petsAdopted: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = 'http://localhost:3000/admin';

  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {}

  getStats(): Observable<AdminStats> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.get<AdminStats>(`${this.baseUrl}/stats`, { headers });
  }

  getStatusBreakdown(): Observable<Array<{ label: string; value: number }>> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.get<Array<{ label: string; value: number }>>(`${this.baseUrl}/stats/breeds`, { headers });
  }

  getUsers(): Observable<User[]> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers });
  }

  getPetsAvailable(): Observable<Pet[]> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.get<Pet[]>(`${this.baseUrl}/pets-available`, { headers });
  }

  getPetsAdopted(): Observable<Pet[]> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.get<Pet[]>(`${this.baseUrl}/pets-adopted`, { headers });
  }
}
