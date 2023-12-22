import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ngxService } from 'src/app/shared/services/incident-services/ngxservice';

@Component({
  selector: 'app-custom-image-viewer',
  templateUrl: './custom-image-viewer.component.html',
  styleUrls: ['./custom-image-viewer.component.scss'],

animations: [
  trigger('slideAnimation', [
      state('prev', style({ transform: 'translateX(0%)' })),
      state('next', style({ transform: 'translateX(0%)' })),
      state('current', style({ transform: 'translateX(0)' })),
      transition('* => prev', [
          style({ transform: 'translateX(-100%)' }),
          animate('500ms ease-in-out')
      ]),
      transition('* => next', [
          style({ transform: 'translateX(100%)' }),
          animate('500ms ease-in-out')
      ]),
      transition('* => current', [
          style({ transform: 'translateX(0)' }),
          animate('500ms ease-in-out')
      ])
  ])
]
})
export class CustomImageViewerComponent {
  @Input() imageSrc:any;
  @Input() falseEvent:any;
  @Input() historyView:any;
  slideIndex: number = 0;
    slideDirection: 'prev' | 'next' | 'current' = 'current';

    constructor(public ngxservice:ngxService){

    }

  navigate(direction: 'prev' | 'next') {
    this.slideDirection = direction;
    if (direction === 'prev' && this.slideIndex > 0) {
        this.slideIndex--;
    } else if (direction === 'next' && this.slideIndex < this.imageSrc.length - 1) {
        this.slideIndex++;
    }
}
slideshow(n:any){
  if(this.slideIndex > n){
   this.navigate('next')
   this.slideIndex = n
  }
  else{
    this.navigate('prev')
    this.slideIndex = n

  }
}
closeEvent(){
this.ngxservice.isShowImagePreview = false
}
}
