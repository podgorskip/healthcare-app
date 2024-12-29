import { TestBed } from '@angular/core/testing';

import { MongoUserRepository } from './mongo-user-repository.service';

describe('MongoUserRepository', () => {
  let service: MongoUserRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongoUserRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
