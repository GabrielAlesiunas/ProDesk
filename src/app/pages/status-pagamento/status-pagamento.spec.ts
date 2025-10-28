import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPagamento } from './status-pagamento';

describe('StatusPagamento', () => {
  let component: StatusPagamento;
  let fixture: ComponentFixture<StatusPagamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPagamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPagamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
