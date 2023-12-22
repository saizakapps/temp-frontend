import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAccessComponent } from './application-access.component';

describe('ApplicationAccessComponent', () => {
  let component: ApplicationAccessComponent;
  let fixture: ComponentFixture<ApplicationAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
