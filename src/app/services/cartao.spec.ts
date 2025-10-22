import { TestBed } from '@angular/core/testing';

import { Cartao } from './cartao';

describe('Cartao', () => {
  let service: Cartao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cartao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
