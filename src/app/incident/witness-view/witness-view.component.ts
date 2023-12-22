import { Component,OnInit,Input,Output, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-witness-view',
  templateUrl: './witness-view.component.html',
  styleUrls: ['./witness-view.component.scss']
})
export class WitnessViewComponent implements OnInit {
@Input() witnessList:any;
@Output() witnessEditDeleteEvent = new EventEmitter<any>();
public currentIndex:number = 0;
public witnessInputData:any;
constructor(private dialog:MatDialog){

}
ngOnInit():void{
}
editWitness(content:any,index:number){
	this.witnessInputData = this.witnessList[index];
  let data = {isEdit:true,isDelete:false,editData:this.witnessList[index],index:index,content:content};
   
    this.witnessEditDeleteEvent.emit(data);
    // this.dialog.open(content, {
    //   width: '450px',
    //   enterAnimationDuration:'100ms',
    //   exitAnimationDuration:'1500ms'
    // })
}

deleteConfirmBox(content:any,index:number){
   this.currentIndex = index;
    this.dialog.open(content, {
      width: '400px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })
}
deleteWitness(){
  let data = {isEdit:false,isDelete:true,editData:this.witnessList[this.currentIndex],index:this.currentIndex};
   this.witnessEditDeleteEvent.emit(data);
}
saveWitness(e:any){
	this.witnessInputData.witnessName = e.witnessName;
	this.witnessInputData.witnessContactNumber = e.witnessContactNumber;
	this.witnessInputData.witnessAddress = e.witnessAddress;
	this.witnessInputData.witnessStatement = e.witnessStatement;
	this.witnessInputData.witnessUnwillingToInvolve = e.witnessUnwillingToInvolve;
	let data = {isEdit:true,isDelete:false,editData:this.witnessInputData,index:this.currentIndex};
   this.witnessEditDeleteEvent.emit(data);
}
}
