import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleProductoComponent } from './dialog-detalle-producto.component';

describe('DialogDetalleProductoComponent', () => {
  let component: DialogDetalleProductoComponent;
  let fixture: ComponentFixture<DialogDetalleProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDetalleProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
