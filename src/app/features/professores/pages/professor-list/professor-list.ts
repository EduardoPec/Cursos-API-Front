import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { ReadProfessorDto } from '../../../../shared/dtos/professor/ReadProfessorDto';
import { ProfessorService } from '../../services/professor.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-professor-list',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './professor-list.html',
  styleUrl: '../../../estudantes/pages/estudante-list/estudante-list.css',
})
export class ProfessorList implements OnInit {
  private readonly service = inject(ProfessorService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);

  professores: ReadProfessorDto[] = [];
  carregando = false;
  mensagemErro = '';
  filtro = '';

  get professoresFiltrados(): ReadProfessorDto[] {
    const termo = this.filtro.trim().toLocaleLowerCase('pt-BR');
    return termo
      ? this.professores.filter(professor =>
          professor.nomeCompleto.toLocaleLowerCase('pt-BR').includes(termo)
          || professor.username.toLocaleLowerCase('pt-BR').includes(termo)
          || professor.email.toLocaleLowerCase('pt-BR').includes(termo))
      : this.professores;
  }

  limparFiltro(): void {
    this.filtro = '';
  }

  ngOnInit(): void {
    this.carregando = true;
    this.service
      .listar()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: professores => this.professores = professores,
        error: () => this.mensagemErro = 'Não foi possível carregar os professores.',
      });
  }
}
