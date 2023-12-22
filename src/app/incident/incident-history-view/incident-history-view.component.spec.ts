import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentHistoryViewComponent } from './incident-history-view.component';

describe('IncidentHistoryViewComponent', () => {
  let component: IncidentHistoryViewComponent;
  let fixture: ComponentFixture<IncidentHistoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentHistoryViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
