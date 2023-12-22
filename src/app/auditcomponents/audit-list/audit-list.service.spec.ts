import { TestBed } from '@angular/core/testing';

import { AuditListService } from './audit-list.service';

describe('AuditListService', () => {
  let service: AuditListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
