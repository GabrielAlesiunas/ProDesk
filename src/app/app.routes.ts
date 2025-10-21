import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { Locatorio } from './pages/locatorio/locatorio'
import { Anfitriao } from './pages/anfitriao/anfitriao';
import { Contato } from './pages/contato/contato';
import { Perfil } from './pages/perfil/perfil';
import { Reserva } from './pages/reserva/reserva';
import { CadastrarEspaco } from './pages/cadastrar-espaco/cadastrar-espaco';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'locatorio', component: Locatorio },
  { path: 'anfitriao', component: Anfitriao },
  { path: 'contato', component: Contato },
  { path: 'perfil', component: Perfil },
  { path: 'reserva', component: Reserva },
  { path: 'cadastrar-espaco', component: CadastrarEspaco },
  { path: '**', redirectTo: 'login' }
];