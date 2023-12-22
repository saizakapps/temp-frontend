import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentMobileCreateComponent } from './incident-mobile-create.component';

describe('IncidentMobileCreateComponent', () => {
  let component: IncidentMobileCreateComponent;
  let fixture: ComponentFixture<IncidentMobileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentMobileCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentMobileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
