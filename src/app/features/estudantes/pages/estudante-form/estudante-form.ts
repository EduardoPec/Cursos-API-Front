import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstudanteService } from '../../services/estudante.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { UpdateEstudanteDto } from '../../../../shared/dtos/estudante/UpdateEstudanteDto';

@Component({
  selector: 'app-estudante-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './estudante-form.html',
  styleUrl: './estudante-form.css',
})
export class EstudanteForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(EstudanteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly form = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
  });
  id: number | null = null;
  carregando = false;
  salvando = false;
  mensagemErro = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/estudantes']);
      return;
    }
    this.id = id;
    this.carregando = true;
    this.service.buscarPorId(id).subscribe({
      next: (estudante) => {
        this.form.patchValue(estudante);
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

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.id) return;
    this.salvando = true;
    this.mensagemErro = '';
    const valor = this.form.getRawValue();
    const dto: UpdateEstudanteDto = {
      nomeCompleto: valor.nomeCompleto.trim(),
      email: valor.email.trim(),
    };
    this.service
      .atualizar(this.id, dto)
      .pipe(finalize(() => {
        this.salvando = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => this.router.navigate(['/estudantes', this.id]),
        error: (erro: HttpErrorResponse) => {
          this.mensagemErro = erro.status === 409
            ? 'Este e-mail já está sendo utilizado.'
            : erro.status === 400
              ? 'A API rejeitou os dados informados. Revise o nome e o e-mail.'
              : 'Não foi possível atualizar o estudante.';
        },
      });
  }
}
