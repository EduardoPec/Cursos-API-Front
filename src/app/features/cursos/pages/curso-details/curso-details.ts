import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { ReadCursoDto } from '../../../../shared/dtos/curso/ReadCursoDto';

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
  curso: ReadCursoDto | null = null;
  carregando = true;
  mensagemErro = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.buscarPorId(id).subscribe({
      next: (curso) => {
        this.curso = curso;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar o curso.';
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
