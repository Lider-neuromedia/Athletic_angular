import { TestBed } from '@angular/core/testing';

import { GlobalVarService } from './global-var.service';

describe('GlobalVarService', () => {
  let service: GlobalVarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalVarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
