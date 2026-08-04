import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EstudanteService } from '../../services/estudante.service';
import { ReadEstudanteDto } from '../../../../shared/dtos/estudante/ReadEstudanteDto';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-estudante-list',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './estudante-list.html',
  styleUrl: './estudante-list.css',
})
export class EstudanteList implements OnInit {
  private readonly service = inject(EstudanteService);
  private readonly cdr = inject(ChangeDetectorRef);
  estudantes: ReadEstudanteDto[] = [];
  carregando = false;
  mensagemErro = '';
  filtro = '';

  ngOnInit(): void {
    this.carregar();
  }

  get estudantesFiltrados(): ReadEstudanteDto[] {
    const termo = this.filtro.trim().toLocaleLowerCase('pt-BR');
    return termo
      ? this.estudantes.filter((estudante) =>
          estudante.nomeCompleto.toLocaleLowerCase('pt-BR').includes(termo)
          || estudante.email.toLocaleLowerCase('pt-BR').includes(termo))
      : this.estudantes;
  }

  limparFiltro(): void {
    this.filtro = '';
  }

  carregar(): void {
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
        next: (estudantes) => {
          this.estudantes = estudantes;
          this.cdr.markForCheck();
        },
        error: () => {
          this.mensagemErro = 'Não foi possível carregar os estudantes.';
        },
      });
  }
}
