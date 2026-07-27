import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudanteList } from './estudante-list';

describe('EstudanteList', () => {
  let component: EstudanteList;
  let fixture: ComponentFixture<EstudanteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudanteList],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudanteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
