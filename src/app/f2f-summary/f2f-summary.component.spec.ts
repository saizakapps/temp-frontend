import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F2fSummaryComponent } from './f2f-summary.component';

describe('F2fSummaryComponent', () => {
  let component: F2fSummaryComponent;
  let fixture: ComponentFixture<F2fSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F2fSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F2fSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
