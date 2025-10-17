import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import {Locatorio} from './pages/locatorio/locatorio'
import { Anfitriao } from './pages/anfitriao/anfitriao';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'locatorio', component: Locatorio },
  { path: 'anfitriao', component: Anfitriao },
  { path: '**', redirectTo: 'login' }
];