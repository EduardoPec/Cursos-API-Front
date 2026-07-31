/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { InscricaoService } from './inscricao.service';

describe('Service: Inscricao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InscricaoService]
    });
  });

  it('should ...', inject([InscricaoService], (service: InscricaoService) => {
    expect(service).toBeTruthy();
  }));
});
