import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudanteForm } from './estudante-form';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('EstudanteForm', () => {
  let component: EstudanteForm;
  let fixture: ComponentFixture<EstudanteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudanteForm],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudanteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
