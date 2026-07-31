import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudanteDetails } from './estudante-details';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('EstudanteDetails', () => {
  let component: EstudanteDetails;
  let fixture: ComponentFixture<EstudanteDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudanteDetails],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudanteDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
