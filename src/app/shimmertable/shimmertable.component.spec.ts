import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShimmertableComponent } from './shimmertable.component';

describe('ShimmertableComponent', () => {
  let component: ShimmertableComponent;
  let fixture: ComponentFixture<ShimmertableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShimmertableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShimmertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
