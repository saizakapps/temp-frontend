import { Component, OnInit,Input } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { CommonService } from 'src/app/shared/services/incident-services/common.service';
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
	@Input() pdfURL:any;
	public pdfHttpHeader = {
   Cookie: document.cookie,
   'sec-fetch-mode': 'no-cors'
  }
  constructor(public common:CommonService){
  	pdfDefaultOptions.assetsFolder = 'assets';
  }
  ngOnInit():void{
  }
  pdfStarts(){
    this.common.pdfLoader = true
  }
  pdfStop(){
    this.common.pdfLoader = false
  }
}
