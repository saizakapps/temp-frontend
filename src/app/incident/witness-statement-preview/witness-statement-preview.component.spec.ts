import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessStatementPreviewComponent } from './witness-statement-preview.component';

describe('WitnessStatementPreviewComponent', () => {
  let component: WitnessStatementPreviewComponent;
  let fixture: ComponentFixture<WitnessStatementPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WitnessStatementPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WitnessStatementPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
