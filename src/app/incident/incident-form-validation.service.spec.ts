import { TestBed } from '@angular/core/testing';

import { IncidentFormValidationService } from './incident-form-validation.service';

describe('IncidentFormValidationService', () => {
  let service: IncidentFormValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentFormValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
