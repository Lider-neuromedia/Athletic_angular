import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDireccionesComponent } from './modal-direcciones.component';

describe('ModalDireccionesComponent', () => {
  let component: ModalDireccionesComponent;
  let fixture: ComponentFixture<ModalDireccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
