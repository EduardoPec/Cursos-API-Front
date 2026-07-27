import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstudanteService } from '../../services/estudante.service';
import { Observable } from 'rxjs';

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
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]]
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
      next: estudante => { this.form.patchValue(estudante); this.carregando = false; this.cdr.markForCheck(); },
      error: () => { this.mensagemErro = 'Não foi possível carregar o estudante.'; this.carregando = false; this.cdr.markForCheck(); }
    });
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    this.mensagemErro = '';
    const requisicao: Observable<unknown> = this.id
      ? this.service.atualizar(this.id, this.form.getRawValue())
      : this.service.criar(this.form.getRawValue());
    requisicao.subscribe({
      next: () => this.router.navigate(['/estudantes']),
      error: () => { this.mensagemErro = 'Não foi possível salvar o estudante.'; this.salvando = false; this.cdr.markForCheck(); }
    });
  }
}
