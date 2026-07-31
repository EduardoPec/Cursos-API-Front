import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { finalize, forkJoin, Observable, timeout } from 'rxjs';
import { ProfessorService } from '../../../professores/services/professor.service';
import { ReadProfessorDto } from '../../../../shared/dtos/professor/ReadProfessorDto';
import { CreateCursoDto } from '../../../../shared/dtos/curso/CreateCursoDto';
import { UpdateCursoDto } from '../../../../shared/dtos/curso/UpdateCursoDto';

@Component({
  selector: 'app-curso-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.css',
})
export class CursoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CursoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly professorService = inject(ProfessorService);

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    descricao: ['', [Validators.required, Validators.maxLength(1000)]],
    categoria: ['', [Validators.required, Validators.maxLength(100)]],
    cargaHoraria: [1, [Validators.required, Validators.min(1)]],
    professorId: this.fb.control<number | null>(null),
  });

  id: number | null = null;
  carregando = false;
  salvando = false;
  mensagemErro = '';
  professores: ReadProfessorDto[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregando = true;
    if (!id) {
      this.professorService.listar().subscribe({
        next: professores => {
          this.professores = professores;
          this.carregando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.mensagemErro = 'Não foi possível carregar os professores.';
          this.carregando = false;
          this.cdr.markForCheck();
        },
      });
      return;
    }
    this.id = id;
    forkJoin({
      curso: this.service.buscarPorId(id),
      professores: this.professorService.listar(),
    }).subscribe({
      next: dados => {
        this.professores = dados.professores;
        this.form.patchValue(dados.curso);
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar o curso e os professores.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.mensagemErro = '';
    const valor = this.form.getRawValue();
    const professorId = valor.professorId === null ? null : Number(valor.professorId);
    const dto: CreateCursoDto | UpdateCursoDto = {
      titulo: valor.titulo,
      descricao: valor.descricao,
      categoria: valor.categoria,
      cargaHoraria: valor.cargaHoraria,
      professorId,
    };
    const requisicao: Observable<unknown> = this.id
      ? this.service.atualizar(this.id, dto)
      : this.service.criar(dto);
    requisicao
      .pipe(
        timeout(15000),
        finalize(() => {
          this.salvando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => this.router.navigate(['/cursos']),
        error: (erro) => {
          console.error('Erro ao salvar curso:', erro);
          this.mensagemErro =
            erro.status === 401
              ? 'A API exige autenticação para criar cursos. Faça login ou libere este endpoint no backend.'
              : 'Não foi possível salvar o curso.';
          this.cdr.markForCheck();
        },
      });
  }
}
