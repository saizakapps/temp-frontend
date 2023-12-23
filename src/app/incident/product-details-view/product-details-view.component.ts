import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from "../../shared/services/incident-services/common.service";
@Component({
  selector: 'app-product-details-view',
  templateUrl: './product-details-view.component.html',
  styleUrls: ['./product-details-view.component.scss']
})
export class ProductDetailsViewComponent implements OnInit{
	@Input() productDetailsData:any;
	@Output() productDetailsEdit = new EventEmitter<any>();
	isRedacted:boolean = false;
   constructor(private common:CommonService){

   }
   ngOnInit():void{
let createdOn = this.productDetailsData.showData.createdOn;
let redactedRule = this.productDetailsData.redactRuleData.redactRules;
      if(redactedRule=='Yes'){
         this.isRedacted=this.common.compareDateTwoMonthCompleted(createdOn, this.productDetailsData.redactRuleData.redactedDays);
      }
      this.isRedacted=this.productDetailsData.showData.isRedacted
   }
   editProductDetails(){
      this.productDetailsEdit.emit(this.productDetailsData);
   }
}
