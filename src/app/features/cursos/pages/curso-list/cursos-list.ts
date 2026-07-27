import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CursoService } from '../../services/curso.service';
import { ReadCursoDto } from '../../../../shared/dtos/curso/ReadCursoDto';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-cursos-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './cursos-list.html',
  styleUrl: './cursos-list.css'
})
export class CursosList implements OnInit {
  private readonly cursoService = inject(CursoService);
  private readonly cdr = inject(ChangeDetectorRef);

  cursos: ReadCursoDto[] = [];
  carregando = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.carregarCursos();
  }

  carregarCursos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.cursoService.listar().pipe(
      timeout(10000),
      finalize(() => {
        this.carregando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: cursos => {
        this.cursos = cursos;
        this.cdr.markForCheck();
      },
      error: erro => {
        console.error(erro);
        this.mensagemErro = erro.name === 'TimeoutError'
          ? 'A API demorou para responder.'
          : 'Erro ao carregar os cursos!';
      }
    });
  }
}
