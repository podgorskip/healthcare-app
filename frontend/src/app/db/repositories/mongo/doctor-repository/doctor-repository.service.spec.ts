import { TestBed } from '@angular/core/testing';

import { DoctorRepositoryService } from './doctor-repository.service';

describe('DoctorRepositoryService', () => {
  let service: DoctorRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
