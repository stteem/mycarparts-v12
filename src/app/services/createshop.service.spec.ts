import { TestBed } from '@angular/core/testing';

import { CreateshopService } from './createshop.service';

describe('CreateshopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateshopService = TestBed.get(CreateshopService);
    expect(service).toBeTruthy();
  });
});
