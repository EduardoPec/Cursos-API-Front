import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ReadInscricaoDto } from '../../../../shared/dtos/inscricao/ReadInscricaoDto';
import { Status } from '../../../../shared/enums/Status.enum';
import { CursoService } from '../../../cursos/services/curso.service';
import { EstudanteService } from '../../../estudantes/services/estudante.service';
import { InscricaoService } from '../../services/inscricao.service';

@Component({
  selector: 'app-inscricao-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './inscricao-details.html',
  styleUrl: './inscricao-details.css'
})
export class InscricaoDetails implements OnInit {
  private readonly service = inject(InscricaoService);
  private readonly cursoService = inject(CursoService);
  private readonly estudanteService = inject(EstudanteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  inscricao: ReadInscricaoDto | null = null;
  curso = '';
  estudante = '';
  carregando = true;
  mensagemErro = '';
  readonly Status = Status;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      inscricao: this.service.buscarPorId(id),
      cursos: this.cursoService.listar(),
      estudantes: this.estudanteService.listar()
    }).subscribe({
      next: dados => {
        this.inscricao = dados.inscricao;
        this.curso = dados.cursos.find(curso => curso.id === dados.inscricao.cursoId)?.titulo ?? `Curso #${dados.inscricao.cursoId}`;
        this.estudante = dados.estudantes.find(estudante => estudante.id === dados.inscricao.estudanteId)?.nomeCompleto ?? `Estudante #${dados.inscricao.estudanteId}`;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: erro => {
        console.error(erro);
        this.mensagemErro = 'Não foi possível carregar a inscrição.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  excluir(): void {
    if (!this.inscricao || !window.confirm('Deseja excluir esta inscrição?')) return;
    this.service.deletar(this.inscricao.id).subscribe({
      next: () => this.router.navigate(['/inscricoes']),
      error: erro => {
        console.error(erro);
        this.mensagemErro = 'Não foi possível excluir a inscrição.';
        this.cdr.markForCheck();
      }
    });
  }
}
