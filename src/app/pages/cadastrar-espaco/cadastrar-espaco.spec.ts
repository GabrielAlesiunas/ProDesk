import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarEspaco } from './cadastrar-espaco';

describe('CadastrarEspaco', () => {
  let component: CadastrarEspaco;
  let fixture: ComponentFixture<CadastrarEspaco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarEspaco]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarEspaco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
