import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudanteForm } from './estudante-form';

describe('EstudanteForm', () => {
  let component: EstudanteForm;
  let fixture: ComponentFixture<EstudanteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudanteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudanteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
