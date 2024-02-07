import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

  export class ngxService {
   showLoader:boolean = false;
   shimmerTable : boolean = true;
   recordButton : boolean = false;
   userName : string = "";
   userId : any;
   selectedRowData:any [] = [];
   selectedRowLength = 0;
   donwloadHide:boolean = true;
   sendData:any[] = [];
   isAllselect:boolean = false;
   indeterminate:boolean = false;
   sendCRData:any[] = [];
   selectedCountryRegionData:any[] = [];
   selectedRegionData:any[] = [];
   assignedManagerData:any[] = [];
   viewednameData:any[] = [];
   selectedYear:any;
   hideTable:boolean = false;
   isShowImagePreview:boolean = false;
   onlyNew:boolean = false;
   inspected:boolean = false;
   commonauditTablelist:any = [];
   TempcommonauditTablelist:any = [];
   selectedassignedManagerType:any = [];
   selectedviewedNameBy:any = [];
   fixedauditTablelist:any = [];
   AccessdataAudit:any;
   filterStore: string = '';
   mobileView:boolean = false;
   nextpathValue:any;
   auditShimmerWidth:any
   activesort:any;
   auditReadonly:boolean = false
   dateSortValue = '';
   disableFilter = false;
   reviewpdfData:any[] = [];
   updatepdfData:any[] = [];
   storenameData:any[] = [];
}
