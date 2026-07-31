import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoDetails } from './curso-details';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('CursoDetails', () => {
  let component: CursoDetails;
  let fixture: ComponentFixture<CursoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoDetails],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CursoDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
