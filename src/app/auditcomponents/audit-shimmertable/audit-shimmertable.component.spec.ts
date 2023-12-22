import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditShimmertableComponent } from './audit-shimmertable.component';

describe('ShimmertableComponent', () => {
  let component: AuditShimmertableComponent;
  let fixture: ComponentFixture<AuditShimmertableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditShimmertableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditShimmertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
