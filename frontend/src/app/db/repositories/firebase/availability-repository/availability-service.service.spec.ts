import { TestBed } from '@angular/core/testing';
import { FirebaseAvailabilityRepository } from './AvailabilityRepository';

describe('FirebaseAvailabilityRepository', () => {
  let service: FirebaseAvailabilityRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseAvailabilityRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
