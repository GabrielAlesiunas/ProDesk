import { TestBed } from '@angular/core/testing';

import { Espacos } from './espacos';

describe('Usuarios', () => {
  let service: Espacos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Espacos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
