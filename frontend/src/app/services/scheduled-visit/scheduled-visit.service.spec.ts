import { TestBed } from '@angular/core/testing';

import { ScheduledVisitService } from './scheduled-visit.service';

describe('ScheduledVisitService', () => {
  let service: ScheduledVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduledVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
