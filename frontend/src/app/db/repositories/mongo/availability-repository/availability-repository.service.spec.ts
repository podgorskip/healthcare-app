import { TestBed } from '@angular/core/testing';

import { MongoAvailabilityRepository } from './availability-repository.service';

describe('MongoAvailabilityRepository', () => {
  let service: MongoAvailabilityRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongoAvailabilityRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
