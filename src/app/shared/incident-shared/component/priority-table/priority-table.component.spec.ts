import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityTableComponent } from './priority-table.component';

describe('PriorityTableComponent', () => {
  let component: PriorityTableComponent;
  let fixture: ComponentFixture<PriorityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
