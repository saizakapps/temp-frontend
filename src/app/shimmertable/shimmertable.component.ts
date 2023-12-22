import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shimmertable',
  templateUrl: './shimmertable.component.html',
  styleUrls: ['./shimmertable.component.scss']
})
export class ShimmertableComponent implements OnInit {
  @Input() type:any;
  constructor() { }

  ngOnInit(): void {
  }

}
