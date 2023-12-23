import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues-handling-view',
  templateUrl: './issues-handling-view.component.html',
  styleUrls: ['./issues-handling-view.component.scss']
})
export class IssuesHandlingViewComponent implements OnInit{
	@Input() issuesHandlingData:any;
	@Output() issuesHandlingEdit = new EventEmitter<any>();
  ispriorityShow = false;
   constructor(public router:Router){

   }
   ngOnInit():void{

this.ispriorityShow = (this.issuesHandlingData.showData.formType=="Product" || this.issuesHandlingData.showData.formType=="product")?true:false;
   
   }
   editIssuesHandlingDetails(){
      this.issuesHandlingEdit.emit(this.issuesHandlingData);
   }
   ngAfterViewInit():void{
     this.ispriorityShow = (this.issuesHandlingData.showData.formType=="Product" || this.issuesHandlingData.showData.formType=="product")?true:false;
      
   }
}
