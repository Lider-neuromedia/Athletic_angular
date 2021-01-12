import { TestBed } from '@angular/core/testing';

import { LoginGlobalService } from './login-global.service';

describe('LoginGlobalService', () => {
  let service: LoginGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
