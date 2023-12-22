import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentShimmerTableComponent } from './incident-shimmer-table.component';

describe('IncidentShimmerTableComponent', () => {
  let component: IncidentShimmerTableComponent;
  let fixture: ComponentFixture<IncidentShimmerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentShimmerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentShimmerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
