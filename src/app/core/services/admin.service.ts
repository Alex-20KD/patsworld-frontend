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
  private readonly usersUrl = 'http://localhost:3000/users';

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

  getAllUsers(): Observable<User[]> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.get<User[]>(this.usersUrl, { headers });
  }

  toggleUserBan(id: string, isBanned: boolean): Observable<User> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/ban`, { isBanned }, { headers });
  }

  updateUserRole(id: string, role: 'admin' | 'user'): Observable<User> {
    const currentRole = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': currentRole });
    return this.http.patch<User>(`${this.usersUrl}/${id}/role`, { role }, { headers });
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

  getPetsPending(): Observable<Pet[]> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.get<Pet[]>(`${this.baseUrl}/pets-pending`, { headers });
  }

  approvePet(id: string): Observable<Pet> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.patch<Pet>(`${this.baseUrl}/pets/${id}/approve`, {}, { headers });
  }

  deletePet(id: string): Observable<{ message: string }> {
    const role = this.auth.currentUser?.role ?? '';
    const headers = new HttpHeaders({ 'X-User-Role': role });
    return this.http.delete<{ message: string }>(`${this.baseUrl}/pets/${id}`, { headers });
  }
}
