import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarDireccionesComponent } from './guardar-direcciones.component';

describe('GuardarDireccionesComponent', () => {
  let component: GuardarDireccionesComponent;
  let fixture: ComponentFixture<GuardarDireccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
