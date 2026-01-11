import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PetListComponent } from './features/pet-list/pet-list.component';
import { PetDetailComponent } from './features/pet-detail/pet-detail.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { PetCreateComponent } from './features/pet-create/pet-create.component';
import { AuthService } from './core/services/auth.service';

const authGuard = () => {
	const auth = inject(AuthService);
	const router = inject(Router);
	if (!auth.isLoggedIn) {
		router.navigate(['/login']);
		return false;
	}
	return true;
};

export const routes: Routes = [
	{ path: '', component: PetListComponent },
	{ path: 'pet/:id', component: PetDetailComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'publish', component: PetCreateComponent, canActivate: [authGuard] },
];
