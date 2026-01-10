import { Routes } from '@angular/router';
import { PetListComponent } from './features/pet-list/pet-list.component';
import { PetDetailComponent } from './features/pet-detail/pet-detail.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';

export const routes: Routes = [
	{ path: '', component: PetListComponent },
	{ path: 'pet/:id', component: PetDetailComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
];
