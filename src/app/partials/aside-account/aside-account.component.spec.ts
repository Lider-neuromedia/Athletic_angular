import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideAccountComponent } from './aside-account.component';

describe('AsideAccountComponent', () => {
  let component: AsideAccountComponent;
  let fixture: ComponentFixture<AsideAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
