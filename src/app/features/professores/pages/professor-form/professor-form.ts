import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { CreateProfessorDto } from '../../../../shared/dtos/professor/CreateProfessorDto';
import { UpdateProfessorDto } from '../../../../shared/dtos/professor/UpdateProfessorDto';
import { ProfessorService } from '../../services/professor.service';

@Component({
  selector: 'app-professor-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './professor-form.html',
  styleUrl: '../../../estudantes/pages/estudante-form/estudante-form.css',
})
export class ProfessorForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProfessorService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required, Validators.maxLength(150)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    especialidade: [''],
    biografia: [''],
  });
  id: number | null = null;
  carregando = false;
  salvando = false;
  mensagemErro = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.id = id;
    this.form.controls.username.disable();
    this.form.controls.password.disable();
    this.carregando = true;
    this.service.buscarPorId(id).subscribe({
      next: professor => {
        this.form.patchValue({
          nomeCompleto: professor.nomeCompleto,
          username: professor.username,
          email: professor.email,
          especialidade: professor.especialidade ?? '',
          biografia: professor.biografia ?? '',
        });
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

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.mensagemErro = '';
    const valor = this.form.getRawValue();
    const opcionais = {
      especialidade: valor.especialidade.trim() || null,
      biografia: valor.biografia.trim() || null,
    };
    let requisicao: Observable<unknown>;
    if (this.id) {
      const dto: UpdateProfessorDto = {
        nomeCompleto: valor.nomeCompleto,
        email: valor.email,
        ...opcionais,
      };
      requisicao = this.service.atualizar(this.id, dto);
    } else {
      const dto: CreateProfessorDto = {
        nomeCompleto: valor.nomeCompleto,
        username: valor.username,
        email: valor.email,
        password: valor.password,
        ...opcionais,
      };
      requisicao = this.service.criar(dto);
    }
    requisicao.pipe(finalize(() => {
      this.salvando = false;
      this.cdr.markForCheck();
    })).subscribe({
      next: () => this.router.navigate(['/professores']),
      error: () => this.mensagemErro = 'Não foi possível salvar o professor.',
    });
  }
}
