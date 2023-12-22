import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomImageViewerComponent } from './custom-image-viewer.component';

describe('CustomImageViewerComponent', () => {
  let component: CustomImageViewerComponent;
  let fixture: ComponentFixture<CustomImageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomImageViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
