import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceVerificationViewComponent } from './insurance-verification-view.component';

describe('InsuranceVerificationViewComponent', () => {
  let component: InsuranceVerificationViewComponent;
  let fixture: ComponentFixture<InsuranceVerificationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceVerificationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceVerificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
