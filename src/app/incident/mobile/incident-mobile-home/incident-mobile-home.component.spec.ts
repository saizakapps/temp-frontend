import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentMobileHomeComponent } from './incident-mobile-home.component';

describe('IncidentMobileHomeComponent', () => {
  let component: IncidentMobileHomeComponent;
  let fixture: ComponentFixture<IncidentMobileHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentMobileHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentMobileHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
