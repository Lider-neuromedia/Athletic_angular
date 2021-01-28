import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCuponComponent } from './detalle-cupon.component';

describe('DetalleCuponComponent', () => {
  let component: DetalleCuponComponent;
  let fixture: ComponentFixture<DetalleCuponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleCuponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCuponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
