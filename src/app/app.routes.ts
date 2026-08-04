import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/auth/auth.guard';
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
import { ProfessorList } from './features/professores/pages/professor-list/professor-list';
import { ProfessorForm } from './features/professores/pages/professor-form/professor-form';
import { ProfessorDetails } from './features/professores/pages/professor-details/professor-details';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'cadastro', component: Cadastro, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'cursos', component: CursosList, canActivate: [authGuard] },
  { path: 'cursos/novo', component: CursoForm, canActivate: [authGuard, adminGuard] },
  { path: 'cursos/:id/editar', component: CursoForm, canActivate: [authGuard, adminGuard] },
  { path: 'cursos/:id', component: CursoDetails, canActivate: [authGuard] },
  { path: 'estudantes', component: EstudanteList, canActivate: [authGuard, adminGuard] },
  { path: 'estudantes/:id/editar', component: EstudanteForm, canActivate: [authGuard, adminGuard] },
  { path: 'estudantes/:id', component: EstudanteDetails, canActivate: [authGuard, adminGuard] },
  { path: 'professores', component: ProfessorList, canActivate: [authGuard] },
  { path: 'professores/novo', component: ProfessorForm, canActivate: [authGuard, adminGuard] },
  { path: 'professores/:id/editar', component: ProfessorForm, canActivate: [authGuard, adminGuard] },
  { path: 'professores/:id', component: ProfessorDetails, canActivate: [authGuard] },
  { path: 'inscricoes', component: InscricaoList, canActivate: [authGuard, adminGuard] },
  { path: 'inscricoes/nova', component: InscricaoForm, canActivate: [authGuard, adminGuard] },
  { path: 'inscricoes/:id', component: InscricaoDetails, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'login' }
];
