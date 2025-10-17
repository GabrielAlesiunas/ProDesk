import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Locatorio } from './locatorio';

describe('Locatorio', () => {
  let component: Locatorio;
  let fixture: ComponentFixture<Locatorio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Locatorio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Locatorio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
