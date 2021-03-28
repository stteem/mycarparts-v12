import { TestBed } from '@angular/core/testing';

import { SignupGuardService } from './signup-guard.service';

describe('SignupGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignupGuardService = TestBed.get(SignupGuardService);
    expect(service).toBeTruthy();
  });
});
