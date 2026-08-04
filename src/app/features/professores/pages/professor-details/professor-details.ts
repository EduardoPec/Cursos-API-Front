import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReadProfessorDto } from '../../../../shared/dtos/professor/ReadProfessorDto';
import { ProfessorService } from '../../services/professor.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-professor-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './professor-details.html',
  styleUrl: '../../../estudantes/pages/estudante-details/estudante-details.css',
})
export class ProfessorDetails implements OnInit {
  private readonly service = inject(ProfessorService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);

  professor: ReadProfessorDto | null = null;
  carregando = true;
  excluindo = false;
  mensagemErro = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.service.listar().subscribe({
      next: professores => {
        this.professor = professores.find(professor => String(professor.id) === id) ?? null;
        if (!this.professor) {
          this.mensagemErro = 'Professor não encontrado.';
        }
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar o professor.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  excluir(): void {
    if (!this.professor || !window.confirm('Deseja excluir este professor?')) return;
    this.excluindo = true;
    this.service.deletar(this.professor.id).subscribe({
      next: () => this.router.navigate(['/professores']),
      error: () => {
        this.mensagemErro = 'Não foi possível excluir o professor.';
        this.excluindo = false;
        this.cdr.markForCheck();
      },
    });
  }
}
