import { Component,OnInit,Input,ViewChild,EventEmitter,Output,OnChanges } from '@angular/core';
import {MatPaginator, } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
//import {MatTableModule} from '@angular/material/table';
import { RequestApiService } from '../../../services/incident-services/request-api.service';
import { Utils } from '../../../incident-shared/module/utils';
import { CommonService } from '../../../services/incident-services/common.service';
import { IncidentService } from '../../../../incident/incident.service';
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.scss']
})
export class HistoryTableComponent implements OnInit {

  //dataSource = ELEMENT_DATA;
  @Input() tableData:any;
  @Output() allListEvent = new EventEmitter<any>();
   dataSource:any;
   constructor(private incidentService:IncidentService,private route:Router,private dailog:MatDialog){}
   ngOnInit():void{
   }

   restoreClick(rowData:any){
    let incidentSelectedTypeData={id:1,name:''};
    if(rowData.incidentType=='customer'){
     incidentSelectedTypeData= {id:1,name:'Customer'};
    }else if(rowData.incidentType=='employee'){
    	 incidentSelectedTypeData= {id:2,name:'Employee'};
    }else if(rowData.incidentType=='contractor'){
    	incidentSelectedTypeData= {id:3,name:'Contractor'};
    }else if(rowData.incidentType=='product'){
    	incidentSelectedTypeData= {id:4,name:'Product'};
    }

    let incidentCreateData ={isAdd:false,idIncident:rowData.id,incidentSelectedTypeData:incidentSelectedTypeData,incidentRowData:rowData};
  this.incidentService.historyIncidentsubject$.next(incidentCreateData);
  this.dailog.closeAll();
  this.route.navigate((['incident-history']))
   }

}
