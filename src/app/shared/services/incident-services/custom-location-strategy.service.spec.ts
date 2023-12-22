import { TestBed } from '@angular/core/testing';

import { CustomLocationStrategyService } from './custom-location-strategy.service';

describe('CustomLocationStrategyService', () => {
  let service: CustomLocationStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomLocationStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
