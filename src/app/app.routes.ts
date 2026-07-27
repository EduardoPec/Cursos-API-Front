import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { Login } from './features/auth/pages/login/login';
import { Cadastro } from './features/auth/pages/cadastro/cadastro';
import { CursosList } from './features/cursos/pages/curso-list/cursos-list';
import { CursoForm } from './features/cursos/pages/curso-form/curso-form';
import { CursoDetails } from './features/cursos/pages/curso-details/curso-details';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { EstudanteList } from './features/estudantes/pages/estudante-list/estudante-list';
import { EstudanteForm } from './features/estudantes/pages/estudante-form/estudante-form';
import { EstudanteDetails } from './features/estudantes/pages/estudante-details/estudante-details';
import { InscricaoList } from './features/inscricoes/pages/inscricao-list/inscricao-list';
import { InscricaoForm } from './features/inscricoes/pages/inscricao-form/inscricao-form';
import { InscricaoDetails } from './features/inscricoes/pages/inscricao-details/inscricao-details';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'cadastro', component: Cadastro, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'cursos', component: CursosList, canActivate: [authGuard] },
  { path: 'cursos/novo', component: CursoForm, canActivate: [authGuard] },
  { path: 'cursos/:id/editar', component: CursoForm, canActivate: [authGuard] },
  { path: 'cursos/:id', component: CursoDetails, canActivate: [authGuard] },
  { path: 'estudantes', component: EstudanteList, canActivate: [authGuard] },
  { path: 'estudantes/novo', component: EstudanteForm, canActivate: [authGuard] },
  { path: 'estudantes/:id/editar', component: EstudanteForm, canActivate: [authGuard] },
  { path: 'estudantes/:id', component: EstudanteDetails, canActivate: [authGuard] },
  { path: 'inscricoes', component: InscricaoList, canActivate: [authGuard] },
  { path: 'inscricoes/nova', component: InscricaoForm, canActivate: [authGuard] },
  { path: 'inscricoes/:id', component: InscricaoDetails, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
