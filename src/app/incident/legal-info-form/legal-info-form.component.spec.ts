import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalInfoFormComponent } from './legal-info-form.component';

describe('LegalInfoFormComponent', () => {
  let component: LegalInfoFormComponent;
  let fixture: ComponentFixture<LegalInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalInfoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
