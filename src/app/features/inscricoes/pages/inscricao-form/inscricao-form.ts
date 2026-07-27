import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InscricaoService } from '../../services/inscricao.service';
import { CursoService } from '../../../cursos/services/curso.service';
import { EstudanteService } from '../../../estudantes/services/estudante.service';
import { ReadCursoDto } from '../../../../shared/dtos/curso/ReadCursoDto';
import { ReadEstudanteDto } from '../../../../shared/dtos/estudante/ReadEstudanteDto';
import { Status } from '../../../../shared/enums/Status.enum';

@Component({
  selector: 'app-inscricao-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscricao-form.html',
  styleUrl: './inscricao-form.css',
})
export class InscricaoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(InscricaoService);
  private readonly cursoService = inject(CursoService);
  private readonly estudanteService = inject(EstudanteService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly form = this.fb.nonNullable.group({
    estudanteId: [0, [Validators.required, Validators.min(1)]],
    cursoId: [0, [Validators.required, Validators.min(1)]],
    status: [Status.ATIVO, Validators.required]
  });
  cursos: ReadCursoDto[] = [];
  estudantes: ReadEstudanteDto[] = [];
  carregando = true;
  salvando = false;
  mensagemErro = '';
  readonly Status = Status;

  ngOnInit(): void {
    forkJoin({
      cursos: this.cursoService.listar(),
      estudantes: this.estudanteService.listar()
    }).subscribe({
      next: dados => { this.cursos = dados.cursos; this.estudantes = dados.estudantes; this.carregando = false; this.cdr.markForCheck(); },
      error: () => { this.mensagemErro = 'Não foi possível carregar cursos e estudantes.'; this.carregando = false; this.cdr.markForCheck(); }
    });
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    this.service.criar(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/inscricoes']),
      error: () => { this.mensagemErro = 'Não foi possível realizar a inscrição.'; this.salvando = false; this.cdr.markForCheck(); }
    });
  }
}
