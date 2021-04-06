import { TestBed } from '@angular/core/testing';

import { StoreitemsService } from './storeitems.service';

describe('StoreitemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreitemsService = TestBed.get(StoreitemsService);
    expect(service).toBeTruthy();
  });
});
