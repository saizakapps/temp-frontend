import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F2fReportsComponent } from './f2f-reports.component';

describe('F2fReportsComponent', () => {
  let component: F2fReportsComponent;
  let fixture: ComponentFixture<F2fReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F2fReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F2fReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
