import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInfoFormComponent } from './other-info-form.component';

describe('OtherInfoFormComponent', () => {
  let component: OtherInfoFormComponent;
  let fixture: ComponentFixture<OtherInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherInfoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
