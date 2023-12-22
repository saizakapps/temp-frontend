import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCustomTableComponent } from './audit-custom-table.component';

describe('CustomTableComponent', () => {
  let component: AuditCustomTableComponent;
  let fixture: ComponentFixture<AuditCustomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditCustomTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCustomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
