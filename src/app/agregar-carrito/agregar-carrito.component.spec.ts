import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCarritoComponent } from './agregar-carrito.component';

describe('AgregarCarritoComponent', () => {
  let component: AgregarCarritoComponent;
  let fixture: ComponentFixture<AgregarCarritoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarCarritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
