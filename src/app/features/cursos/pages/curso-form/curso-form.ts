import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { finalize, Observable, timeout } from 'rxjs';

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

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    descricao: ['', [Validators.required, Validators.maxLength(1000)]],
    categoria: ['', [Validators.required, Validators.maxLength(100)]],
    cargaHoraria: [1, [Validators.required, Validators.min(1)]],
  });

  id: number | null = null;
  carregando = false;
  salvando = false;
  mensagemErro = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.id = id;
    this.carregando = true;
    this.service.buscarPorId(id).subscribe({
      next: (curso) => {
        this.form.patchValue(curso);
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

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.mensagemErro = '';
    const requisicao: Observable<unknown> = this.id
      ? this.service.atualizar(this.id, this.form.getRawValue())
      : this.service.criar(this.form.getRawValue());
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
