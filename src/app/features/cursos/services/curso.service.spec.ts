/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CursoService } from './curso.service';

describe('Service: Curso', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CursoService]
    });
  });

  it('should ...', inject([CursoService], (service: CursoService) => {
    expect(service).toBeTruthy();
  }));
});
