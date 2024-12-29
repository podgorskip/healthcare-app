import { TestBed } from '@angular/core/testing';

import { MongoVisitRepository } from './visit-repository.service';

describe('MongoVisitRepositoryService', () => {
  let service: MongoVisitRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongoVisitRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
