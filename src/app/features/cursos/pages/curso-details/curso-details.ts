import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { ReadCursoDto } from '../../../../shared/dtos/curso/ReadCursoDto';
import { ProfessorService } from '../../../professores/services/professor.service';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-curso-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './curso-details.html',
  styleUrl: './curso-details.css',
})
export class CursoDetails implements OnInit {
  private readonly service = inject(CursoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly professorService = inject(ProfessorService);
  readonly auth = inject(AuthService);
  curso: ReadCursoDto | null = null;
  professorResponsavel = 'Professor não definido';
  possuiProfessorResponsavel = false;
  carregando = true;
  mensagemErro = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      cursos: this.service.listar(),
      professores: this.professorService.listar().pipe(catchError(() => of([]))),
    }).subscribe({
      next: dados => {
        this.curso = dados.cursos.find(curso => String(curso.id) === id) ?? null;
        if (!this.curso) {
          this.mensagemErro = 'Curso não encontrado.';
          this.carregando = false;
          this.cdr.markForCheck();
          return;
        }
        const professorId = this.curso.professorId;
        if (typeof professorId === 'number') {
          const professor = dados.professores.find(item => item.id === professorId);
          if (professor) {
            this.professorResponsavel = professor.nomeCompleto;
            this.possuiProfessorResponsavel = true;
          }
        }
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar o curso e seu professor responsável.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  excluir(): void {
    if (!this.curso || !window.confirm('Deseja excluir este curso?')) return;
    this.service.deletar(this.curso.id).subscribe({
      next: () => this.router.navigate(['/cursos']),
      error: () => {
        this.mensagemErro = 'Não foi possível excluir o curso.';
        this.cdr.markForCheck();
      },
    });
  }
}
