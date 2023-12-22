import { Component,OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/incident-services/common.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
 constructor(public commonservice : CommonService){

  }
  ngOnInit():void{

  }
  show(){
  this.commonservice.showMenu = !this.commonservice.showMenu
  }
}
