import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlechaArribaComponent } from './flecha-arriba.component';

describe('FlechaArribaComponent', () => {
  let component: FlechaArribaComponent;
  let fixture: ComponentFixture<FlechaArribaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlechaArribaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlechaArribaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
