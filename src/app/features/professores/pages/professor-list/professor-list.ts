import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ReadProfessorDto } from '../../../../shared/dtos/professor/ReadProfessorDto';
import { ProfessorService } from '../../services/professor.service';

@Component({
  selector: 'app-professor-list',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './professor-list.html',
  styleUrl: '../../../estudantes/pages/estudante-list/estudante-list.css',
})
export class ProfessorList implements OnInit {
  private readonly service = inject(ProfessorService);
  private readonly cdr = inject(ChangeDetectorRef);

  professores: ReadProfessorDto[] = [];
  carregando = false;
  mensagemErro = '';
  filtroId = '';

  get professoresFiltrados(): ReadProfessorDto[] {
    const id = this.filtroId.trim();
    return id ? this.professores.filter(professor => String(professor.id) === id) : this.professores;
  }

  limparFiltro(): void {
    this.filtroId = '';
  }

  ngOnInit(): void {
    this.carregando = true;
    this.service
      .listar()
      .pipe(finalize(() => {
        this.carregando = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: professores => this.professores = professores,
        error: () => this.mensagemErro = 'Não foi possível carregar os professores.',
      });
  }
}
