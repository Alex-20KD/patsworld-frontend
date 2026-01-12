import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { AdminService, AdminStats } from '../../core/services/admin.service';
import { User } from '../../core/models/user.model';
import { Pet } from '../../core/models/pet.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  stats?: AdminStats;
  loading = true;
  error?: string;

  currentView: 'users' | 'available' | 'adopted' | 'pending' | null = null;
  users: User[] = [];
  petsAvailable: Pet[] = [];
  petsAdopted: Pet[] = [];
  petsPending: Pet[] = [];

  chartData?: ChartData<'pie', number[], string>;
  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  constructor(private adminService: AdminService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadChart();
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudieron cargar las estadísticas';
        this.loading = false;
      },
    });
  }

  get breakdownCards(): Array<{ label: string; value: number; color: string; percent: number }> {
    const available = this.stats?.petsAvailable ?? 0;
    const adopted = this.stats?.petsAdopted ?? 0;
    const total = available + adopted || 1; // avoid division by zero
    return [
      {
        label: 'Disponibles',
        value: available,
        color: '#6366f1',
        percent: Math.round((available / total) * 100),
      },
      {
        label: 'Adoptados',
        value: adopted,
        color: '#22c55e',
        percent: Math.round((adopted / total) * 100),
      },
    ];
  }

  private loadChart(): void {
    this.adminService.getStatusBreakdown().subscribe({
      next: (data) => {
        this.chartData = {
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: ['#6366f1', '#22c55e'],
            },
          ],
        };
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo cargar el gráfico';
      },
    });
  }

  selectView(view: 'users' | 'available' | 'adopted'): void {
    this.currentView = view;

    if (view === 'users' && this.users.length === 0) {
      this.loadUsers();
    }
    if (view === 'available' && this.petsAvailable.length === 0) {
      this.loadPetsAvailable();
    }
    if (view === 'adopted' && this.petsAdopted.length === 0) {
      this.loadPetsAdopted();
    }
  }

  selectPending(): void {
    this.currentView = 'pending';
    if (this.petsPending.length === 0) {
      this.loadPetsPending();
    }
  }

  private loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudieron cargar los usuarios';
      },
    });
  }

  toggleUserBan(user: User): void {
    const confirmMsg = user.isBanned
      ? `¿Desbloquear a ${user.email}?`
      : `¿Bloquear a ${user.email}?`;
    const ok = confirm(confirmMsg);
    if (!ok) return;

    this.adminService.toggleUserBan(user.id, !user.isBanned).subscribe({
      next: (updated) => {
        this.users = this.users.map((u) => (u.id === updated.id ? { ...u, isBanned: updated.isBanned } : u));
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo actualizar el estado del usuario';
      },
    });
  }

  private loadPetsAvailable(): void {
    this.adminService.getPetsAvailable().subscribe({
      next: (data) => {
        this.petsAvailable = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudieron cargar las mascotas disponibles';
      },
    });
  }

  private loadPetsAdopted(): void {
    this.adminService.getPetsAdopted().subscribe({
      next: (data) => {
        this.petsAdopted = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudieron cargar las mascotas adoptadas';
      },
    });
  }

  private loadPetsPending(): void {
    this.adminService.getPetsPending().subscribe({
      next: (data) => {
        this.petsPending = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudieron cargar las mascotas pendientes';
      },
    });
  }

  approvePet(pet: Pet): void {
    this.adminService.approvePet(pet.id).subscribe({
      next: () => {
        this.petsPending = this.petsPending.filter((p) => p.id !== pet.id);
        if (this.petsAvailable.length > 0) {
          this.petsAvailable = [pet, ...this.petsAvailable];
        }
        if (this.stats) {
          this.stats.petsAvailable += 1;
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo aprobar la mascota';
      },
    });
  }

  rejectPet(pet: Pet): void {
    const confirmMsg = `¿Rechazar la publicación de ${pet.name}?`;
    if (!confirm(confirmMsg)) {
      return;
    }

    this.adminService.deletePet(pet.id).subscribe({
      next: () => {
        this.petsPending = this.petsPending.filter((p) => p.id !== pet.id);
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo rechazar la mascota';
      },
    });
  }
}
