import { TestBed } from '@angular/core/testing';
import { FirebaseUserRepository } from './user-repository.service';

describe('FirebaseUserRepository', () => {
  let service: FirebaseUserRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseUserRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
