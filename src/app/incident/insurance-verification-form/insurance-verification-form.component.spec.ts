import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceVerificationFormComponent } from './insurance-verification-form.component';

describe('InsuranceVerificationFormComponent', () => {
  let component: InsuranceVerificationFormComponent;
  let fixture: ComponentFixture<InsuranceVerificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceVerificationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceVerificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
