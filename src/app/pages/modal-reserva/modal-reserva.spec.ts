import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReserva } from './modal-reserva';

describe('ModalReserva', () => {
  let component: ModalReserva;
  let fixture: ComponentFixture<ModalReserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalReserva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalReserva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
