import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
