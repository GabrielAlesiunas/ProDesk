import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anfitriao } from './anfitriao';

describe('Anfitriao', () => {
  let component: Anfitriao;
  let fixture: ComponentFixture<Anfitriao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Anfitriao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Anfitriao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
