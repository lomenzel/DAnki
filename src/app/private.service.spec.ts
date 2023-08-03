import { TestBed } from '@angular/core/testing';

import { PrivateService } from './private.service';

describe('PrivateService', () => {
  let service: PrivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
