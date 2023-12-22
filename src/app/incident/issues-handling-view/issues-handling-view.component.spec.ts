import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesHandlingViewComponent } from './issues-handling-view.component';

describe('IssuesHandlingViewComponent', () => {
  let component: IssuesHandlingViewComponent;
  let fixture: ComponentFixture<IssuesHandlingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuesHandlingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuesHandlingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
