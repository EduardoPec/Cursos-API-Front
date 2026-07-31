import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CursoService } from '../../../cursos/services/curso.service';
import { EstudanteService } from '../../../estudantes/services/estudante.service';
import { InscricaoService } from '../../../inscricoes/services/inscricao.service';
import { forkJoin } from 'rxjs';
import { Status } from '../../../../shared/enums/Status.enum';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  private readonly cursoService = inject(CursoService);
  private readonly estudanteService = inject(EstudanteService);
  private readonly inscricaoService = inject(InscricaoService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);

  totalCursos = 0;
  totalEstudantes = 0;
  totalInscricoes = 0;
  totalInscricoesCanceladas = 0;

  carregando = false;
  mensagemErro = '';

  ngOnInit() {
    if (this.auth.possuiRole('ADMIN')) {
      this.carregarDashboard();
    }
  }

  carregarDashboard() {
    this.carregando = true;
    this.mensagemErro = '';

    forkJoin({
      cursos: this.cursoService.listar(),
      estudantes: this.estudanteService.listar(),
      inscricoes: this.inscricaoService.listar(),
    }).subscribe({
      next: (resultado) => {
        this.totalCursos = resultado.cursos.length;
        this.totalEstudantes = resultado.estudantes.length;
        this.totalInscricoes = resultado.inscricoes.length;
        this.totalInscricoesCanceladas = resultado.inscricoes.filter(
          (inscricao) => inscricao.status === Status.CANCELADO,
        ).length;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.log(erro);
        this.mensagemErro = 'Não foi possivel carregar o dashboard!';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
