import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, of, timeout } from 'rxjs';
import { InscricaoService } from '../../services/inscricao.service';
import { CursoService } from '../../../cursos/services/curso.service';
import { EstudanteService } from '../../../estudantes/services/estudante.service';
import { ReadInscricaoDto } from '../../../../shared/dtos/inscricao/ReadInscricaoDto';
import { Status } from '../../../../shared/enums/Status.enum';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-inscricao-list',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './inscricao-list.html',
  styleUrl: './inscricao-list.css',
})
export class InscricaoList implements OnInit {
  private readonly service = inject(InscricaoService);
  private readonly cursoService = inject(CursoService);
  private readonly estudanteService = inject(EstudanteService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);
  inscricoes: ReadInscricaoDto[] = [];
  cursos = new Map<number, string>();
  estudantes = new Map<number, string>();
  carregando = false;
  mensagemErro = '';
  filtroEstudante = '';
  readonly Status = Status;

  ngOnInit(): void {
    this.carregar();
  }

  get inscricoesFiltradas(): ReadInscricaoDto[] {
    const estudante = this.filtroEstudante.trim().toLocaleLowerCase('pt-BR');

    return this.inscricoes.filter((inscricao) => {
      const nomeEstudante = this.estudantes.get(inscricao.estudanteId) ?? '';
      return (
        !estudante || nomeEstudante.toLocaleLowerCase('pt-BR').includes(estudante)
      );
    });
  }

  get possuiFiltros(): boolean {
    return Boolean(this.filtroEstudante.trim());
  }

  limparFiltros(): void {
    this.filtroEstudante = '';
  }

  carregar(): void {
    this.carregando = true;
    forkJoin({
      inscricoes: this.service.listar(),
      cursos: this.cursoService.listar(),
      estudantes: this.estudanteService.listar().pipe(catchError(() => of([]))),
    })
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (dados) => {
          this.inscricoes = dados.inscricoes;
          this.cursos = new Map(dados.cursos.map((curso) => [curso.id, curso.titulo]));
          this.estudantes = new Map(
            dados.estudantes.map((estudante) => [estudante.id, estudante.nomeCompleto]),
          );
          this.cdr.markForCheck();
        },
        error: () => {
          this.mensagemErro = 'Não foi possível carregar as inscrições.';
        },
      });
  }
}
