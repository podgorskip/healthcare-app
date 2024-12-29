import { TestBed } from '@angular/core/testing';

import { FirebaseVisitRepository } from './visit-repository.service';

describe('FirebaseVisitRepository', () => {
  let service: FirebaseVisitRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseVisitRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
