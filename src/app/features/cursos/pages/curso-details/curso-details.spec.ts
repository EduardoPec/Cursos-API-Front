import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoDetails } from './curso-details';

describe('CursoDetails', () => {
  let component: CursoDetails;
  let fixture: ComponentFixture<CursoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(CursoDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
