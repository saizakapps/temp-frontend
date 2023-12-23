import { Component,Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {
	@Input() docURL:any;

  viewerurl = "https://docs.google.com/gview?url=%URL%&embedded=true"
  constructor(){}
  ngOnInit():void{

  }
}
