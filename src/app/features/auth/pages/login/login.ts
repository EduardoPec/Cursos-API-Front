import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  carregando = false;
  mensagemErro = '';
  readonly cadastroRealizado = this.route.snapshot.queryParamMap.get('cadastrado') === 'true';
  readonly sessaoExpirada = this.route.snapshot.queryParamMap.get('sessaoExpirada') === 'true';

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.carregando = true;
    this.mensagemErro = '';
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).pipe(
      finalize(() => { this.carregando = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: () => {
        const destino = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(destino);
      },
      error: erro => {
        console.error('Erro no login:', erro);
        this.mensagemErro = erro.status === 401
          ? 'Usuário ou senha inválidos.'
          : 'Não foi possível entrar. Verifique se a API está disponível.';
        this.cdr.markForCheck();
      }
    });
  }
}
