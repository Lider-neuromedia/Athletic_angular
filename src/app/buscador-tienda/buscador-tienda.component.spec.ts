import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorTiendaComponent } from './buscador-tienda.component';

describe('BuscadorTiendaComponent', () => {
  let component: BuscadorTiendaComponent;
  let fixture: ComponentFixture<BuscadorTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
