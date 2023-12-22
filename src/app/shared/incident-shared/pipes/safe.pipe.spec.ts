import { SafePipe } from './safe.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [SafePipe],
      providers: [ SafePipe],
    });
  }),
describe('SafePipe', () => {
  it('create an instance', () => {
    // const pipe = new SafePipe();
     let pipe = TestBed.get(SafePipe);
    expect(pipe).toBeTruthy();
  });
});
