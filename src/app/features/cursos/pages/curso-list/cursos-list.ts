import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CursoService } from '../../services/curso.service';
import { ReadCursoDto } from '../../../../shared/dtos/curso/ReadCursoDto';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-cursos-list',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './cursos-list.html',
  styleUrl: './cursos-list.css',
})
export class CursosList implements OnInit {
  private readonly cursoService = inject(CursoService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);

  cursos: ReadCursoDto[] = [];
  carregando = false;
  mensagemErro = '';
  filtro = '';

  ngOnInit(): void {
    this.carregarCursos();
  }

  get cursosFiltrados(): ReadCursoDto[] {
    const termo = this.filtro.trim().toLocaleLowerCase('pt-BR');
    return termo
      ? this.cursos.filter((curso) =>
          curso.titulo.toLocaleLowerCase('pt-BR').includes(termo)
          || curso.categoria.toLocaleLowerCase('pt-BR').includes(termo))
      : this.cursos;
  }

  limparFiltro(): void {
    this.filtro = '';
  }

  carregarCursos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.cursoService
      .listar()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (cursos) => {
          this.cursos = cursos;
          this.cdr.markForCheck();
        },
        error: (erro) => {
          console.error(erro);
          this.mensagemErro =
            erro.name === 'TimeoutError'
              ? 'A API demorou para responder.'
              : 'Erro ao carregar os cursos!';
        },
      });
  }
}
