import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstudanteService } from '../../services/estudante.service';
import { ReadEstudanteDto } from '../../../../shared/dtos/estudante/ReadEstudanteDto';

@Component({
  selector: 'app-estudante-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './estudante-details.html',
  styleUrl: './estudante-details.css',
})
export class EstudanteDetails implements OnInit {
  private readonly service = inject(EstudanteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  estudante: ReadEstudanteDto | null = null;
  carregando = true;
  mensagemErro = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.service.listar().subscribe({
      next: (estudantes) => {
        this.estudante = estudantes.find(estudante => String(estudante.id) === id) ?? null;
        if (!this.estudante) {
          this.mensagemErro = 'Estudante não encontrado.';
        }
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar o estudante.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  excluir(): void {
    if (!this.estudante || !window.confirm('Deseja excluir este estudante?')) return;
    this.service.deletar(this.estudante.id).subscribe({
      next: () => this.router.navigate(['/estudantes']),
      error: () => {
        this.mensagemErro = 'Não foi possível excluir o estudante.';
        this.cdr.markForCheck();
      },
    });
  }
}
