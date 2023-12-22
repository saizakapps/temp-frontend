import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceViewComponent } from './evidence-view.component';

describe('EvidenceViewComponent', () => {
  let component: EvidenceViewComponent;
  let fixture: ComponentFixture<EvidenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
