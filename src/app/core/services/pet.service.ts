import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly apiUrl = 'http://localhost:3000/pets';

  constructor(private readonly http: HttpClient) {}

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }
  // 👇 AGREGA ESTO: Buscar por ID
  getPetById(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  createPet(payload: FormData): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, payload);
  }

  updatePet(id: string, payload: Partial<Pet>, ownerId: string): Observable<Pet> {
    const headers = new HttpHeaders({ 'X-User-Id': ownerId });
    return this.http.patch<Pet>(`${this.apiUrl}/${id}`, payload, { headers });
  }

  deletePet(id: string, ownerId: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({ 'X-User-Id': ownerId });
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers });
  }
}
