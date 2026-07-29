import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

function senhasIguais(control: AbstractControl): ValidationErrors | null {
  return control.get('password')?.value === control.get('rePassword')?.value
    ? null
    : { senhasDiferentes: true };
}

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', Validators.required],
    },
    { validators: senhasIguais },
  );
  carregando = false;
  mensagemErro = '';

  cadastrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.carregando = true;
    this.mensagemErro = '';
    this.auth
      .cadastrar({ ...this.form.getRawValue(), role: 'ESTUDANTE' })
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => this.router.navigate(['/login'], { queryParams: { cadastrado: true } }),
        error: (erro) => {
          console.error('Erro no cadastro:', erro);
          this.mensagemErro =
            erro.status === 400
              ? 'Não foi possível cadastrar. Verifique os dados ou escolha outro usuário.'
              : 'Não foi possível realizar o cadastro.';
          this.cdr.markForCheck();
        },
      });
  }
}
