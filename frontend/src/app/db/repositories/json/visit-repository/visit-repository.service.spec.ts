import { TestBed } from '@angular/core/testing';

import { JsonVisitRepository } from './visit-repository.service';

describe('JsonVisitRepository', () => {
  let service: JsonVisitRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonVisitRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
