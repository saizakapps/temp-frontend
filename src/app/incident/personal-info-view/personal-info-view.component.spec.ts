import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoViewComponent } from './personal-info-view.component';

describe('PersonalInfoViewComponent', () => {
  let component: PersonalInfoViewComponent;
  let fixture: ComponentFixture<PersonalInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalInfoViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
