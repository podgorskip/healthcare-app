import { TestBed } from '@angular/core/testing';

import { JsonUserRepository } from './user-repository.service';

describe('JsonUserRepository', () => {
  let service: JsonUserRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonUserRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
