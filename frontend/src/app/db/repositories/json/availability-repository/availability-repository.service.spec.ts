import { TestBed } from '@angular/core/testing';

import { JsonAvailabilityRepository } from './availability-repository.service';

describe('JsonAvailabilityRepositoryService', () => {
  let service: JsonAvailabilityRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonAvailabilityRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
