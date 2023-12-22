import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessViewComponent } from './witness-view.component';

describe('WitnessViewComponent', () => {
  let component: WitnessViewComponent;
  let fixture: ComponentFixture<WitnessViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WitnessViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WitnessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
