import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscricaoForm } from './inscricao-form';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('InscricaoForm', () => {
  let component: InscricaoForm;
  let fixture: ComponentFixture<InscricaoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscricaoForm],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(InscricaoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
