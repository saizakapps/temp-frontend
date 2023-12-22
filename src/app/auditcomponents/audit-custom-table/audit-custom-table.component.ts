import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, catchError, fromEvent, map, throwError } from 'rxjs';
import { ngxService } from '../../shared/services/incident-services/ngxservice';
import { Utils } from '../../shared/incident-shared/module/utils';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { RequestApiService } from '../../shared/services/incident-services/request-api.service';
import { CommonService } from '../../shared/services/incident-services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-audit-custom-table',
  templateUrl: './audit-custom-table.component.html',
  styleUrls: ['./audit-custom-table.component.scss'],
})

export class AuditCustomTableComponent {
  @Input() tableData: any;
  @Output() allListEvent = new EventEmitter<any>();
  dataSource: any;
  updateByNameDataHistory: any = [];
  viewednameDataHistory: any = [];
  storenameData: any = [];
  updatepdfData: any = [];
  reviewpdfData: any = [];
  dateSortValue = '';
  recordData = false;
  pdfHttpHeader: any = {};
  selection = new SelectionModel(true, []);
  historyData: any = { colums: [], data: [], showColumn: [] };
  smallShimmer: boolean = false;
  pdfView = false;
  selectedData: any;
  filterApivalue: any;
  isAlreadyFileUploadInProgress: boolean = false;
  base64: any = '';
  uploadText = "Upload";
  public currentRowdata: any;
  tempHistoryData = [];
  form!: FormGroup;
  alertBox = false;
  firstLoader = false;
  pdfLoader = false;
  sendData: any[] = [];
  acivesort: any;
  retryText = false;
  activehistory: number = 0;
  activehistoryData: any;
  mailId = "";
  Emails: any[] = [];
  pdfPath: any;
  pdfUrl: any;
  previousPdfurl: any;
  checkedTablelist:any = [];
  tempTableData:any = [];
  StoredauditList:any = [];
  username:any = '';
  AuditaccessData:any;
  @HostListener('window:keydown.esc', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.pdfView == true) {
      this.pdfView = false;
      this.ngxService.stop();
      this.activehistory = 0;
      this.scorecardView = false;
      this.activescorecard = 0;
    }
  }
  constructor(public formBuilder: FormBuilder, private common: CommonService, public utils: Utils, private http: HttpClient, public ngxservice: ngxService, private api: RequestApiService, private ngxService: NgxUiLoaderService) {
  }
  HealthSafetyAccessData:any;
  ngOnInit(): void {
     let userDetails = JSON.parse(localStorage.getItem('userDetails'));
     this.username = this.ngxservice.userId;
      let allAccessData = JSON.parse(localStorage.getItem('accessApps')) ;
  let accessData = allAccessData.filter(function(item:any){
              return item.app.appCode=='AT';
            });
     //let accessData = JSON.parse(localStorage.getItem('auditAccessData'));
     if(accessData.length > 0){
       this.AuditaccessData = accessData[0].app.modules[0]
     }
    this.pdfPath = this.utils.urlUtils.AUDIT_WEB_URL;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9A-Z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });
    this.historyData.colums = this.utils.TABLE_HEADERS.HISTORY_LIST_TABLE.map(name => name.indexName);
    this.historyData.showColumn = this.utils.TABLE_HEADERS.HISTORY_LIST_TABLE;
    this.scorecardData.colums = this.utils.TABLE_HEADERS.SCORECARD_LIST_TABLE.map(name => name.indexName);
    this.scorecardData.showColumn = this.utils.TABLE_HEADERS.SCORECARD_LIST_TABLE;
    if (this.tableData.data.length > 0 && this.tableData.data[0] !== null) {
      for (let x of this.tableData.data) {
        x.checked = false;
        x.isViewed = false;
      }
      this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
      this.tempTableData = this.tableData.data;
      this.StoredauditList = this.tableData.data;

    }
    // if(this.HealthSafetyAccessData.length > 0){
    // let HealthSafetyAccessData = JSON.parse(localStorage.getItem('HealthSafetyAccessData'));
    // this.ngxservice.AccessdataAudit = HealthSafetyAccessData[0].app.modules[1]
    // }
    if (this.ngxservice.userName == 'SM' || this.ngxservice.userName == 'OM' || this.ngxservice.userName == 'DM') {
      this.tableData.colums = this.utils.TABLE_HEADERS.AUDIT_LIST_TABLE_MANAGER.map(name => name.indexName);
      this.tableData.showColumn = this.utils.TABLE_HEADERS.AUDIT_LIST_TABLE_MANAGER;
    }
    else {
      this.tableData.colums = this.utils.TABLE_HEADERS.AUDIT_LIST_TABLE.map(name => name.indexName);
      this.tableData.showColumn = this.utils.TABLE_HEADERS.AUDIT_LIST_TABLE;
    }
    if (this.tableData.data.length > 0 && this.tableData.data[0] !== null) {
      /* Assigned Manager Filter */
      this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });

      /* Last Viewed Persion Filter */
      this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.reviewByName != '' && item.reviewByName != null;
      }).map((role: any) => role.reviewByName))).map(rl => {
        return { name: rl, checked: false }
      });

      /* Store Name Filter Data */
      this.storenameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.storeDescription != '' && item.storeDescription != null;
      }).map((role: any) => role.storeDescription))).map(rl => {
        return { name: rl, checked: false }
      });

      /* Upload Date Filter Data */
      this.updatepdfData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.updatedAt != '' && item.updatedAt != null;
      }).map((role: any) => role.updatedAt))).map(rl => {
        return { name: rl, checked: false }
      });

      /* View Date Filter Data */
      this.reviewpdfData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.reviewAt != '' && item.reviewAt != null;
      }).map((role: any) => role.reviewAt))).map(rl => {
        return { name: rl, checked: false }
      });
    }
  }

  async getAuditlist() {
    this.ngxservice.shimmerTable = true;
    this.tableData.data = [];
    let response: any = await this.api.getData(this.utils.API.STORE_LIST + '?userName=' + this.ngxservice.userId+'&userName='+this.username);
    let auditList = response.payLoad;
    auditList.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
    this.tableData.data = auditList;
    this.tempTableData = auditList;
    this.StoredauditList = auditList;
    /* Assigned Manager Filter */
    this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.assignedManager != '' && item.assignedManager != null;
    }).map((role: any) => role.assignedManager))).map(rl => {
      return { name: rl, checked: false }
    });

    /* Last Viewed Persion Filter */
    this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.reviewByName != '' && item.reviewByName != null;
    }).map((role: any) => role.reviewByName))).map(rl => {
      return { name: rl, checked: false }
    });

    if (this.tableData.data == 0) {
      this.ngxservice.recordButton = true;
    }
    else{
      this.ngxservice.recordButton = false
    }
    this.ngxservice.shimmerTable = false;
  }

  get f() { return this.form.controls; }

  splitNameurl(url: any) {
    var filename = url.substring(url.lastIndexOf('\\') + 1);
    return filename;
  }

  selectAll(e: any) {
    if(this.tableData.data.length > 0){
    for (let x of this.tableData.data) {
      x.checked = e.checked;
      this.ngxservice.indeterminate = false;
    }
  }
    this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
    this.ngxservice.isAllselect = !this.ngxservice.isAllselect;
    this.ngxservice.selectedRowData = this.tableData.data.filter((x: any) => x.checked == true)

    let fileavailableTable = this.tableData.data.filter((x: any) => x.files !== null)
    if (fileavailableTable.length > 0) {
      this.ngxservice.donwloadHide = false
    }
    else {
      this.ngxservice.donwloadHide = true
    }
  }

  checkAll() {
    this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
    if (this.tableData.data.every((x: any) => x.checked !== true)) {
      this.ngxservice.indeterminate = false;
    }
    else {
      this.ngxservice.indeterminate = true;
    }

    if (this.tableData.data.every((x: any) => x.checked == true)) {
      this.ngxservice.indeterminate = false;
      this.ngxservice.isAllselect = true;
    }
    if (this.tableData.data.every((x: any) => x.checked == false)) {
      this.ngxservice.indeterminate = false;
      this.ngxservice.isAllselect = false;
    }

    this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
    this.ngxservice.selectedRowData = this.tableData.data.filter((x: any) => x.checked == true);
  }

  selectParticular(e: any, index: number, element: any) {
    element.checked = e.checked;

    this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
    this.ngxservice.selectedRowData = this.tableData.data.filter((x: any) => x.checked == true);
    let fileavailable = this.ngxservice.selectedRowData.filter((x: any) => x.files !== null)
    if (fileavailable.length > 0) {
      this.ngxservice.donwloadHide = false
    }
    else {
      this.ngxservice.donwloadHide = true
    }

    if (this.ngxservice.selectedRowData.length == 0) {
      let fileavailableTable = this.tableData.data.filter((x: any) => x.files !== null)
      if (fileavailableTable.length > 0) {
        this.ngxservice.donwloadHide = false
      }
      else {
        this.ngxservice.donwloadHide = true
      }
    }
    this.checkAll();
  }

  getFilterData(indexName: any) {
    this.filterApivalue = indexName;
  }
  managerFilter(e:any, type:string){
       this.acivesort = -1;
       this.ngxservice.filterStore = ''
       if(type == 'assign'){
       this.getAuduiListFilterbyManager();
       }
       else{
       this.getAuduiListFilterbyViewer();
       }

  }
  // typeChange(e: any, type:string) {
  //   this.acivesort = -1;
  //   this.ngxservice.isAllselect = false;
  //   this.ngxservice.indeterminate = false;
  //   for (let x of this.ngxservice.viewednameData) {
  //     x.checked = false;
  //   }
  //   setTimeout(() => {
  //     this.getAuduiListFilterbyManagerold();
  //   }, 200);

  // }

  // viewChange(e: any, type:string) {
  //   this.ngxservice.isAllselect = false;
  //   this.ngxservice.indeterminate = false;
  //   this.acivesort = -1;
  //   for (let x of this.ngxservice.assignedManagerData) {
  //     x.checked = false;
  //   }
  //   setTimeout(() => {
  //     this.getAuduiListFilterbyManagerold();
  //   }, 200);
  // }

  typeChange1(e: any) {
    for (let x of this.viewednameDataHistory) {
      x.checked = false;
    }
    this.getAuduiListFilterbyHistory();
  }

  viewChange1(e: any) {
    for (let x of this.updateByNameDataHistory) {
      x.checked = false;
    }
    this.getAuduiListFilterbyHistory1();
  }

  dateSort(value: any) {
    this.ngxservice.inspected = false;
    this.ngxservice.onlyNew = false;
    this.ngxservice.filterStore = ''

    if (value == 2) {
      this.dateSortValue = 'asc';
      setTimeout(() => {
        this.getAuduiListFilter();
      }, 200);
    } else if (value == 3) {
      this.dateSortValue = 'desc';
      setTimeout(() => {
        this.getAuduiListFilter();
      }, 200);
    }
    else {
      if (this.dateSortValue !== '') {
        this.dateSortValue = '';
        // this.ngxservice.isAllselect = false;
        // this.ngxservice.selectedRowLength = 0;
        setTimeout(() => {
          this.getAuduiListFilterEmpty();
        }, 200);
      }
    }
    for (let x of this.ngxservice.viewednameData) {
      x.checked = false;
    }
    for (let x of this.ngxservice.assignedManagerData) {
      x.checked = false;
    }
    this.ngxservice.selectedassignedManagerType = [];
    this.ngxservice.selectedviewedNameBy = [];
  }

  selectSort(value: any) {
    this.acivesort = value
  }

  async getAuduiListFilterEmpty() {
    this.ngxservice.shimmerTable = true
    this.tableData.data = [];
    let param: any;
    if (this.ngxservice.userName == "AD" || this.ngxservice.userName == "HR") {
      param = {
        "sortType": this.dateSortValue,
        "sortBy": "",
        "country": (this.ngxservice.selectedCountryRegionData.length) ? this.ngxservice.selectedCountryRegionData : null,
        "filterType": "country",
         "userName":this.username
      }
    }
    else if (this.ngxservice.userName == "OM") {
      param = {
        "sortType": this.dateSortValue,
        "sortBy": "",
        "region": (this.ngxservice.selectedRegionData.length) ? this.ngxservice.selectedRegionData : null,
        "filterType": "region",
         "userName":this.username
      }
    }
    else {
      param = {
        "sortType": this.dateSortValue,
        "sortBy": "",
        "userName":this.username
      }
    }
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.AUDIT_LIST_FILTER, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
      this.tableData.data = res.payLoad;
      this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
      this.tempTableData = this.tableData.data;
       /* Assigned Manager Filter */
       this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });

      /* Last Viewed Persion Filter */
      this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.reviewByName != '' && item.reviewByName != null;
      }).map((role: any) => role.reviewByName))).map(rl => {
        return { name: rl, checked: false }
      });

      for( let x of this.tableData.data){
        let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
          return item.auditId==x.auditId
        })
        if(isExist.length > 0){
          x.checked=true;
        }
      }
      this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
      if (this.tableData.data.length == 0) {
        this.ngxservice.recordButton = true
        this.ngxservice.shimmerTable = false
      }
      else {
        this.ngxservice.recordButton = false
      }
      this.ngxservice.shimmerTable = false
    });
  }

  async getAuduiListFilter() {
    this.ngxservice.shimmerTable = true
    this.tableData.data = [];
    let param: any;
    if (this.ngxservice.userName == "AD" || this.ngxservice.userName == "HR") {
      param = {
        "sortType": this.dateSortValue,
        "sortBy": this.filterApivalue,
        "country": (this.ngxservice.selectedCountryRegionData.length) ? this.ngxservice.selectedCountryRegionData : null,
        "filterType": "country",
         "userName":this.username
      }
    }
    else if (this.ngxservice.userName == "OM") {
      param = {
        "sortType": this.dateSortValue,
        "sortBy": this.filterApivalue,
        "region": (this.ngxservice.selectedRegionData.length) ? this.ngxservice.selectedRegionData : null,
        "filterType": "region",
         "userName":this.username
      }
    }
    else {
      param = {
        "sortType": this.dateSortValue,
        "sortBy": this.filterApivalue,
         "userName":this.username
      }
    }
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.AUDIT_LIST_FILTER, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
      this.tableData.data = res.payLoad;
      // this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
      this.tempTableData = this.tableData.data;
         /* Assigned Manager Filter */
         this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.assignedManager != '' && item.assignedManager != null;
        }).map((role: any) => role.assignedManager))).map(rl => {
          return { name: rl, checked: false }
        });

        /* Last Viewed Persion Filter */
        this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });

      for( let x of this.tableData.data){
        let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
          return item.auditId==x.auditId
        })
        if(isExist.length > 0){
          x.checked=true;
        }
      }
      this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
      if (this.tableData.data.length == 0) {
        this.ngxservice.recordButton = true
        this.ngxservice.shimmerTable = false
      }
      else {
        this.ngxservice.recordButton = false
      }
      this.ngxservice.shimmerTable = false
    });
  }

  // async getAuduiListFilterbyManagerold() {
  //   this.tableData.data = [];
  //   this.ngxservice.shimmerTable = true;
  //   this.ngxservice.inspected = false;
  //   this.ngxservice.onlyNew = false;
  //   let assignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
  //     return item.checked == true
  //   }).map((item: any) => item.name);
  //   this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
  //     return item.checked == true
  //   })
  //   let viewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
  //     return item.checked == true
  //   }).map((item: any) => item.name);
  //   this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
  //     return item.checked == true
  //   })
  //   let param: any;
  //   if (this.ngxservice.userName == "AD" || this.ngxservice.userName == "HR") {
  //     param = {
  //       "assignedManager": assignedManagerType,
  //       "reviewManager": viewedNameBy,
  //       "country": (this.ngxservice.selectedCountryRegionData.length) ? this.ngxservice.selectedCountryRegionData : null,
  //       "filterType": "country",
  //        "userName":this.username
  //     }
  //   }
  //   else if (this.ngxservice.userName == "OM") {
  //     param = {
  //       "assignedManager": assignedManagerType,
  //       "reviewManager": viewedNameBy,
  //       "region": (this.ngxservice.selectedRegionData.length) ? this.ngxservice.selectedRegionData : null,
  //       "filterType": "region",
  //        "userName":this.username
  //     }
  //   }
  //   else {
  //     param = {
  //       "assignedManager": assignedManagerType,
  //       "reviewManager": viewedNameBy,
  //        "userName":this.username
  //     }
  //   }
  //   let Token = localStorage.getItem("authenticationToken")
  //   this.http.post(this.utils.API.AUDIT_LIST_MANAGER_FILTER, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
  //     this.tableData.data = res.payLoad;
  //     this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
  //     this.tempTableData = this.tableData.data;
  //     for( let x of this.tableData.data){
  //       let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
  //         return item.auditId==x.auditId
  //       })
  //       if(isExist.length > 0){
  //         x.checked=true;
  //       }
  //     }
  //     this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
  //     if (this.tableData.data.length == 0) {
  //       this.ngxservice.recordButton = true
  //       this.ngxservice.shimmerTable = false
  //     }
  //     else {
  //       this.ngxservice.recordButton = false
  //     }
  //     this.ngxservice.shimmerTable = false
  //   });
  // }

  validImageFileExtensions = ['application/pdf'];
  public isValidImageFile(imageType: string, imageSize: number, imageName: string) {
    let msg = '';
    let isValid = true;
    let isValidImageType = this.validImageFileExtensions.includes(imageType);
    let isImageSizeExceed5MB = ((imageSize / (1024 * 1024)) > 5) ? true : false;
    if (!isValidImageType) {
      msg = 'Sorry, ' + imageName + ' is invalid, allowed extensions are: ' + this.validImageFileExtensions.join(', ');
      isValid = false;
      this.common.openSnackBar(msg, 2, "Invalid")
    } else if (isImageSizeExceed5MB === true) {
      msg = 'Pdf exceed maximum size 5MB ';
      isValid = false;
      this.common.openSnackBar(msg, 2, "Invalid")
    }
    let data = { isValid: isValid, msg: msg };
    return data;
  }

  /* Upload Event in Main Table*/
  upload(e: any, data: any, apiUrl: any) {
    let Token = localStorage.getItem("authenticationToken")
    let imageType = e.srcElement.files[0].type;
    let imageSize = e.srcElement.files[0].size;
    let isValidResponse = this.isValidImageFile(imageType, imageSize, e.srcElement.files[0].name);
    if (isValidResponse.isValid === false) {
      e.srcElement.files[0].value = '';
    } else {
      let uploadForm = new FormData();

      uploadForm.append('file', e.srcElement.files[0]);
      uploadForm.append('auditId', data.auditId);
      uploadForm.append('storeCode', data.storeCode);
      uploadForm.append('storeDescription', data.storeDescription);
      uploadForm.append('countryId', data.countryId);
      uploadForm.append('countryDescription', data.countryDesc);
      uploadForm.append('regionId', data.regionId);
      uploadForm.append('regionDescription', data.regionDesc);
      uploadForm.append('userName',this.username);
      this.http.post(apiUrl, uploadForm, {
        headers: {Authorization: 'Bearer '+Token },
        reportProgress: true,
        observe: "events"
      })
        .pipe(
          map((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              let storeIndex = this.tableData.data.findIndex((value: any) => {
                return value.storeCode == data.storeCode;
              });
              this.tableData.data[storeIndex].fileName = 'Uploading...';
            }
            else if (event.type == HttpEventType.Response) {
              if (event.body.payLoad) {
                let storeCode = event.body.payLoad.storeCode;
                let storeIndex = this.tableData.data.findIndex((value: any) => {
                  return value.storeCode == storeCode;
                });
                this.tableData.data[storeIndex].storeAuditStatus = event.body.payLoad.storeAuditStatus;
                this.tableData.data[storeIndex].updateByName = event.body.payLoad.updateByName;
                this.tableData.data[storeIndex].updatedAt = event.body.payLoad.updatedAt;
                this.tableData.data[storeIndex].isHistory = event.body.payLoad.isHistory;
                this.tableData.data[storeIndex].files = event.body.payLoad.files;
                this.tableData.data[storeIndex].reviewAt = event.body.payLoad.reviewAt;
                this.tableData.data[storeIndex].reviewByName = event.body.payLoad.reviewByName;
                this.tableData.data[storeIndex].fileName = event.body.payLoad.fileName;
                this.ngxservice.donwloadHide = false;
                this.retryText = false;
                /* Upload Date Filter Data */
                this.updatepdfData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
                  return item.updatedAt != '' && item.updatedAt != null;
                }).map((role: any) => role.updatedAt))).map(rl => {
                  return { name: rl, checked: false }
                });
              }
            }
          }),
          catchError((err: any) => {
            let storeIndex = this.tableData.data.findIndex((value: any) => {
              return value.storeCode == data.storeCode;
            });
            if (!this.pdfView) {
              this.tableData.data[storeIndex].fileName = 'Retry';
            }
            this.isAlreadyFileUploadInProgress = false;
            return throwError(err.message);
          })
        )
        .toPromise();
    };
    if (this.tableData.data.every((name: any) => name.fileName == null)) {
      this.ngxservice.donwloadHide = true
    }
    else {
      this.ngxservice.donwloadHide = false
    }
  }

  /* Upload Event in History Table*/
  uploadNew(e: any, data: any, apiUrl: any) {
    // let isExistData=this.historyData.data.filter((item:any)=>{
    //   return item.fileName.toLowerCase()==e.srcElement.files[0].name.toLowerCase()
    // })
    // if(isExistData.length>0){
    //   this.alertBox = true;
    // }
    // else{
    let Token = localStorage.getItem("authenticationToken")
    this.retryText = false;
    let imageType = e.srcElement.files[0].type;
    let imageSize = e.srcElement.files[0].size;
    let isValidResponse = this.isValidImageFile(imageType, imageSize, e.srcElement.files[0].name);
    if (isValidResponse.isValid === false) {
      e.srcElement.files[0].value = '';
    } else {
      let uploadForm = new FormData();

      uploadForm.append('file', e.srcElement.files[0]);
      uploadForm.append('auditId', data.auditId);
      uploadForm.append('storeCode', data.storeCode);
      uploadForm.append('storeDescription', data.storeDescription);
      uploadForm.append('countryId', data.countryId);
      uploadForm.append('countryDescription', data.countryDesc);
      uploadForm.append('regionId', data.regionId);
      uploadForm.append('regionDescription', data.regionDesc);
      uploadForm.append('userName',this.username);
      this.http.post(apiUrl, uploadForm, {
        headers: {Authorization: 'Bearer '+Token },
        reportProgress: true,
        observe: "events"
      })
        .pipe(
          map((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.smallShimmer = true;
              this.retryText = false;
            } else if (event.type == HttpEventType.Response) {
              if (event.body.payLoad) {
                let storeCode = event.body.payLoad.storeCode;
                let storeIndex = this.tableData.data.findIndex((value: any) => {
                  return value.storeCode == storeCode;
                });
                this.tableData.data[storeIndex].storeAuditStatus = event.body.payLoad.storeAuditStatus;
                this.tableData.data[storeIndex].updateByName = event.body.payLoad.updateByName;
                this.tableData.data[storeIndex].updatedAt = event.body.payLoad.updatedAt;
                this.tableData.data[storeIndex].isHistory = event.body.payLoad.isHistory;
                this.tableData.data[storeIndex].files = event.body.payLoad.files;
                this.tableData.data[storeIndex].reviewAt = event.body.payLoad.reviewAt;
                this.tableData.data[storeIndex].reviewByName = event.body.payLoad.reviewByName;
                this.tableData.data[storeIndex].fileName = event.body.payLoad.fileName;
                this.historyData.data = event.body.payLoad.auditHistoryFileDTO;
                this.historyData.data.unshift(this.selectedData);
                this.tempHistoryData = this.historyData.data;
                this.activehistory = 0;
                this.activehistoryData = this.historyData.data[this.activehistory];
                this.pdfUrl = this.pdfPath + this.activehistoryData.files; 
                this.ngxservice.donwloadHide = false;
                this.smallShimmer = false;
                this.retryText = false;
                /* Assigned Manager Filter History Table*/
                this.updateByNameDataHistory = Array.from(new Set(this.historyData.data.filter(function (item: any) {
                  return item.updateByName != '' && item.updateByName != null;
                }).map((role: any) => role.updateByName))).map(rl => {
                  return { name: rl, checked: false }
                });

                /* Last Viewed Persion Filter History*/
                this.viewednameDataHistory = Array.from(new Set(this.historyData.data.filter(function (item: any) {
                  return item.reviewByName != '' && item.reviewByName != null;
                }).map((role: any) => role.reviewByName))).map(rl => {
                  return { name: rl, checked: false }
                });
              }
            }
          }),
          catchError((err: any) => {
            this.retryText = true
            this.isAlreadyFileUploadInProgress = false;
            return throwError(err.message);
          })
        )
        .toPromise();
    };
    if (this.tableData.data.every((name: any) => name.fileName == null)) {
      this.ngxservice.donwloadHide = true;
    }
    else {
      this.ngxservice.donwloadHide = false;
    }
    // }
    // }
  }

  nullement(e: any) {
    this.retryText = false;
    e.srcElement.value = null;
  }

  showFile(elem: any) {
    this.historyData.data = [];
    this.firstLoader = true;
    this.ngxService.start();
    this.pdfLoader = false;
    this.retryText = false;
    this.pdfHttpHeader = {
      Cookie: document.cookie,
      'sec-fetch-mode': 'no-cors'
    }
    this.selectedData = elem;
    this.pdfView = true;
    // if(this.tableData.data[this.selectedData].reviewByName == null){
    let viewForm = {
    auditId: this.selectedData.auditId,
    userName: this.ngxservice.userId.toString(),
    };
    this.http.post(this.utils.API.VIEW_FILE, viewForm).subscribe((res: any) => {
      if (res.payLoad) {
        this.smallShimmer = true;
        this.historyData.data = res.payLoad.auditHistoryFileDTO;
        this.historyData.data.unshift(this.selectedData);
        this.tempHistoryData = this.historyData.data;
        this.activehistoryData = this.historyData.data[this.activehistory];
        this.pdfUrl = this.pdfPath + this.activehistoryData.files;
        this.previousPdfurl = this.pdfUrl;
        /* Assigned Manager Filter History Table*/
        this.updateByNameDataHistory = Array.from(new Set(this.historyData.data.filter(function (item: any) {
          return item.updateByName != '' && item.updateByName != null;
        }).map((role: any) => role.updateByName))).map(rl => {
          return { name: rl, checked: false }
        });

        let auditId = res.payLoad.storeCode;
        let auditIndex = this.tableData.data.findIndex((value: any) => {
          return value.storeCode == auditId;
        });

        this.tableData.data[auditIndex].storeAuditStatus = res.payLoad.storeAuditStatus;
        this.tableData.data[auditIndex].reviewByName = res.payLoad.reviewByName;
        this.tableData.data[auditIndex].reviewAt = res.payLoad.reviewAt;
        this.smallShimmer = false;
        /* Last Viewed Persion Filter History*/
        this.viewednameDataHistory = Array.from(new Set(this.historyData.data.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });

        /* Last Viewed Persion Filter */
        this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });

        this.reviewpdfData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewAt != '' && item.reviewAt != null;
        }).map((role: any) => role.reviewAt))).map(rl => {
          return { name: rl, checked: false }
        });
      }
    })
    // }
  }

  async pdfStart() {
    if (this.firstLoader == true) {
      this.ngxService.start();
    }
    else {
      this.pdfLoader = true
    }
  }
  async pdfStop() {
    if (this.firstLoader == true) {
      this.ngxService.stop();
    }
    else {
      this.pdfLoader = false
    }
  }

  getHistoryelement(selecthistory: any, n: any) {
    if (this.activehistory !== n) {
      this.activehistory = n;
      this.pdfLoader = true;
      this.activehistoryData = selecthistory;
      this.pdfUrl = this.pdfPath + this.activehistoryData.files;
      if (this.previousPdfurl == this.pdfUrl) {
        this.pdfLoader = false;
      }
      else {
        this.previousPdfurl = this.pdfUrl;
        this.pdfLoader = true;
      }
      this.firstLoader = false;
      if (this.activehistoryData.reviewByName == null && (this.ngxservice.userName == 'SM' || this.ngxservice.userName == 'OM' || this.ngxservice.userName == 'DM')) {
        let param = {
          "storeCode": this.activehistoryData.storeCode,
          "files": this.activehistoryData.files,
          "updatedTimeStamp": this.activehistoryData.updatedTimeStamp,
          "updateBy": this.activehistoryData.updateBy,
          "reviewBy": this.ngxservice.userId,
        }
        let Token = localStorage.getItem("authenticationToken")
        this.http.post(this.utils.API.GET_HISTORY_VIEWED_NAME, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
          if (res.payLoad) {
            this.historyData.data[this.activehistory].reviewByName = res.payLoad.reviewByName
            /* Last Viewed Persion Filter History*/
            this.viewednameDataHistory = Array.from(new Set(this.historyData.data.filter(function (item: any) {
              return item.reviewByName != '' && item.reviewByName != null;
            }).map((role: any) => role.reviewByName))).map(rl => {
              return { name: rl, checked: false }
            });
          }
        })

      }
    }
  }
  getAuduiListFilterbyManager(){
    this.tableData.data = this.ngxservice.commonauditTablelist;
    let assignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    })
    let viewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    })

          let TempData: any = [];
        for (let x of assignedManagerType) {
          let data = this.tableData.data.filter((item: any) => {
            return item.assignedManager == x;
          })
          for (let x of data) {
           let isFilterData = TempData.filter((data:any)=>{
           return data.auditId == x.auditId
           })
           if(isFilterData.length == 0){
            TempData.push(x);
           }
          }
        }

        if (assignedManagerType.length > 0) {
          this.tableData.data = TempData;
          this.ngxservice.commonauditTablelist = TempData;
          this.ngxservice.assignedManagerData = Array.from(new Set(TempData.filter(function (item: any) {
            return item.assignedManager != '' && item.assignedManager != null;
          }).map((role: any) => role.assignedManager))).map(rl => {
            return { name: rl, checked: true }
          });
          this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
            return item.checked == true
          })
          for( let x of this.tableData.data){
            let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
              return item.auditId==x.auditId
            })
            if(isExist.length > 0){
              x.checked=true;
            }
          }
          this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
          /* Error Part */
          if(viewedNameBy.length == 0){
    this.ngxservice.viewednameData = Array.from(new Set(TempData.filter(function (item: any) {
      return item.reviewByName != '' && item.reviewByName != null;
    }).map((role: any) => role.reviewByName))).map(rl => {
            return { name: rl, checked: false }
          });
      this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
        return item.checked == true
      })
     }

        }
        else if(viewedNameBy.length > 0){
          this.getAuduiListFilterbyViewernew();
          }
          else if(assignedManagerType.length == 0 && viewedNameBy.length == 0){
            // this.getAuditlist();
           this.tableData.data = this.ngxservice.TempcommonauditTablelist;
           this.ngxservice.commonauditTablelist = this.tableData.data
           for( let x of this.tableData.data){
            let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
              return item.auditId==x.auditId
            })
            if(isExist.length > 0){
              x.checked=true;
            }
          }
          this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
           this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
            return item.assignedManager != '' && item.assignedManager != null;
          }).map((role: any) => role.assignedManager))).map(rl => {
            return { name: rl, checked: false }
          });
          this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
            return item.checked == true
          })
          this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
            return item.reviewByName != '' && item.reviewByName != null;
          }).map((role: any) => role.reviewByName))).map(rl => {
            return { name: rl, checked: false }
          });
          this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
            return item.checked == true
          })
          }

          }

  getAuduiListFilterbyManagernew(){
    this.tableData.data = this.StoredauditList;
    let assignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    })
    let viewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    })

          let TempData: any = [];
        for (let x of assignedManagerType) {
          let data = this.tableData.data.filter((item: any) => {
            return item.assignedManager == x;
          })
          for (let x of data) {
           let isFilterData = TempData.filter((data:any)=>{
           return data.auditId == x.auditId
           })
           if(isFilterData.length == 0){
            TempData.push(x);
           }
          }
        }
          this.tableData.data = TempData;
          this.tempTableData = TempData;
          for( let x of this.tableData.data){
            let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
              return item.auditId==x.auditId
            })
            if(isExist.length > 0){
              x.checked=true;
            }
          }
          this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
          this.ngxservice.viewednameData = Array.from(new Set(TempData.filter(function (item: any) {
            return item.reviewByName != '' && item.reviewByName != null;
          }).map((role: any) => role.reviewByName))).map(rl => {
            return { name: rl, checked: false }
          });

            this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
              return item.checked == true
            })
  }
  getAuduiListFilterbyViewer(){
    this.tableData.data = this.ngxservice.commonauditTablelist;
    let assignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    })
    let viewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    })
    let TempData: any = [];

    for (let x of viewedNameBy) {
      let data = this.tableData.data.filter((item: any) => {
        return item.reviewByName == x;
      })
      for (let x of data) {
        let isFilterData = TempData.filter((data:any)=>{
          return data.auditId == x.auditId
          })
          if(isFilterData.length == 0){
           TempData.push(x);
            }
          }

    }
    if (viewedNameBy.length > 0) {
      this.tableData.data = TempData;
      this.ngxservice.commonauditTablelist = TempData;
      for( let x of this.tableData.data){
        let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
          return item.auditId==x.auditId
        })
        if(isExist.length > 0){
          x.checked=true;
        }
      }
      this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
       /* Last Viewed Persion Filter */
    this.ngxservice.viewednameData = Array.from(new Set(TempData.filter(function (item: any) {
      return item.reviewByName != '' && item.reviewByName != null;
    }).map((role: any) => role.reviewByName))).map(rl => {
      return { name: rl, checked: true }
    });

      this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
        return item.checked == true
      })
      /* Error Part */
      if(assignedManagerType.length == 0){
      this.ngxservice.assignedManagerData = Array.from(new Set(TempData.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });
      this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
        return item.checked == true
      })

      }
    }
    else if(assignedManagerType.length > 0){
    this.getAuduiListFilterbyManagernew();
    }
    else if(assignedManagerType.length == 0 && viewedNameBy.length == 0){
      // this.getAuditlist();
      this.tableData.data = this.ngxservice.TempcommonauditTablelist;
      this.ngxservice.commonauditTablelist = this.tableData.data;
      for( let x of this.tableData.data){
        let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
          return item.auditId==x.auditId
        })
        if(isExist.length > 0){
          x.checked=true;
        }
      }
      this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
      this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });
      this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
        return item.checked == true
      })
      this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.reviewByName != '' && item.reviewByName != null;
      }).map((role: any) => role.reviewByName))).map(rl => {
        return { name: rl, checked: false }
      });
      this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
        return item.checked == true
      })
    }

  }

  getAuduiListFilterbyViewernew(){
    this.tableData.data = this.StoredauditList;
    let assignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
      return item.checked == true
    })
    let viewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);
    this.ngxservice.selectedviewedNameBy = this.ngxservice.viewednameData.filter(function (item: any) {
      return item.checked == true
    })
    let TempData: any = [];

    for (let x of viewedNameBy) {
      let data = this.tableData.data.filter((item: any) => {
        return item.reviewByName == x;
      })
      for (let x of data) {
        let isFilterData = TempData.filter((data:any)=>{
          return data.auditId == x.auditId
          })
          if(isFilterData.length == 0){
           TempData.push(x);
            }
          }

    }

      this.tableData.data = TempData;
      this.tempTableData = TempData;
      for( let x of this.tableData.data){
        let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
          return item.auditId==x.auditId
        })
        if(isExist.length > 0){
          x.checked=true;
        }
      }
      this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
      this.ngxservice.assignedManagerData = Array.from(new Set(TempData.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });
      this.ngxservice.selectedassignedManagerType = this.ngxservice.assignedManagerData.filter(function (item: any) {
        return item.checked == true
      })

  }
  async getAuduiListFilterbyHistory() {
    this.historyData.data = this.tempHistoryData;

    let updateByNameTypeHistory = this.updateByNameDataHistory.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);

    let TempHistory: any = []
    for (let x of updateByNameTypeHistory) {
      let data = this.historyData.data.filter((item: any) => {
        return item.updateByName == x;
      })
      for (let x of data) {
        TempHistory.push(x);
      }

    }

    if (updateByNameTypeHistory.length > 0) {
      this.historyData.data = TempHistory;
    }
    else {
      this.historyData.data = this.tempHistoryData;
    }
  }

  async getAuduiListFilterbyHistory1() {
    this.historyData.data = this.tempHistoryData;

    let viewedNameByHistory = this.viewednameDataHistory.filter(function (item: any) {
      return item.checked == true;
    }).map((item: any) => item.name);

    let TempHistory: any = [];
    for (let x of viewedNameByHistory) {
      let data = this.historyData.data.filter((item: any) => {
        return item.reviewByName == x;
      })
      for (let x of data) {
        TempHistory.push(x);
      }
    }
    if (viewedNameByHistory.length > 0) {
      this.historyData.data = TempHistory;
    }
    else {
      this.historyData.data = this.tempHistoryData;
    }
  }

  getMail(e: any) {
    if (this.form.valid) {
      this.mailId = e.target.value;
    }
  }

  sendMail() {
    let param:any;
    if(this.pdfView == true){
    param = {
      "year" : this.ngxservice.selectedYear,
      "storeCode": this.selectedData.storeCode,
      "emailId": this.Emails.toString(),
      "userName":this.username
    }
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.AUDIT_DOWNLIAD_FILE, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
      this.common.openSnackBar(res.payLoad, 2, "")
    });
  }
  else{
    param = {
      "year" : this.ngxservice.selectedYear,
      "storeCode": this.selectedscrecardData.storeCode,
      "emailId": this.Emails.toString(),
      "userName":this.username
    } 
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.DOWNLOAD_SCORECARD_FILE, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
      this.common.openSnackBar(res.payLoad, 2, "")
    });
  }
    this.Emails = []; 
  }

  addMailId() {
    if (this.form.valid) {
      this.Emails.push(this.mailId);
      this.mailId = "";
    }
  }

  removeEmail(m: any) {
    let temp = this.Emails.splice(m, 1);
  }

  cancelMail() {
    this.mailId = '';
    this.Emails = [];
  }

  outsideClick() {
    this.pdfView = false;
    this.scorecardView = false;
    this.activehistory = 0;
    this.activescorecard = 0;
  }

  clearTablefilter() {
    if(this.ngxservice.viewednameData){
    for (let x of this.ngxservice.viewednameData) {
      x.checked = false;
    }
  }
  if(this.ngxservice.assignedManagerData){
    for (let x of this.ngxservice.assignedManagerData) {
      x.checked = false;
    }
  }
  if(this.tableData.data.length > 0){
    for (let x of this.tableData.data) {
      x.checked = false;
    }
  }
    this.ngxservice.selectedassignedManagerType = [];
    this.ngxservice.selectedviewedNameBy = [];
    this.ngxservice.selectedviewedNameBy = [];
    this.ngxservice.selectedRowLength = 0;
    this.ngxservice.selectedRowData = [];
    this.ngxservice.indeterminate = false;
    this.ngxservice.isAllselect = false;
    // this.getAuduiListFilterbyManagerold();
    this.getAuduiListFilterbyManager();
    this.getAuduiListFilterbyViewer();

    if (this.dateSortValue !== '') {
      this.getAuduiListFilterEmpty();
      this.dateSortValue = '';
      this.acivesort = -1;
    }

  }
  scorecardView:any = false
  activescorecard:number = 0;
  activescorecardData: any;
  selectedscrecardData:any;
  scorecardData: any = { colums: [], data: [], showColumn: [] };
  updatepdfscorecardData:any;
  tempscorecardData:any = [];
  updateByNameDatascorecard:any = [];
  scorecardpdfUrl: any;
  scorecardpdfUrlpreviousPdfurl: any;
  uploadscorecard(e: any, data: any, apiUrl: any) {
    let Token = localStorage.getItem("authenticationToken")
    let imageType = e.srcElement.files[0].type;
    let imageSize = e.srcElement.files[0].size;
    let isValidResponse = this.isValidImageFile(imageType, imageSize, e.srcElement.files[0].name);
    if (isValidResponse.isValid === false) {
      e.srcElement.files[0].value = '';
    } else {
      let uploadForm = new FormData();

      uploadForm.append('scoreCardfile', e.srcElement.files[0]);
      uploadForm.append('auditId', data.auditId);
      uploadForm.append('userName', this.ngxservice.userId.toString());

      this.http.post(apiUrl, uploadForm, {
        headers: {Authorization: 'Bearer '+Token },
        reportProgress: true,
        observe: "events"
      })
        .pipe(
          map((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              let storeIndex = this.tableData.data.findIndex((value: any) => {
                return value.storeCode == data.storeCode;
              });
              this.tableData.data[storeIndex].scoreCardFileName = 'Uploading...';
            }
            else if (event.type == HttpEventType.Response) {
              if (event.body.payLoad) {
                let storeCode = event.body.payLoad.storeCode;
                let storeIndex = this.tableData.data.findIndex((value: any) => {
                  return value.storeCode == storeCode;
                });
                this.tableData.data[storeIndex].scoreCardUpdateByName = event.body.payLoad.scoreCardUpdateByName;
                this.tableData.data[storeIndex].scoreCardUpdatedAt = event.body.payLoad.scoreCardUpdatedAt;
                this.tableData.data[storeIndex].scoreCardUpdateBy = event.body.payLoad.scoreCardUpdateBy;
                this.tableData.data[storeIndex].scoreCardFiles = event.body.payLoad.scoreCardFiles;
                this.tableData.data[storeIndex].scoreCardFileName = event.body.payLoad.scoreCardFileName;
                this.retryText = false;
                /* Upload Date Filter Data */
                this.updatepdfscorecardData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
                  return item.updatedAt != '' && item.updatedAt != null;
                }).map((role: any) => role.updatedAt))).map(rl => {
                  return { name: rl, checked: false }
                });
              }
            }
          }),
          catchError((err: any) => {
            let storeIndex = this.tableData.data.findIndex((value: any) => {
              return value.storeCode == data.storeCode;
            });
            if (!this.pdfView) {
              this.tableData.data[storeIndex].scoreCardFileName = 'Retry';
            }
            this.isAlreadyFileUploadInProgress = false;
            return throwError(err.message);
          })
        )
        .toPromise();
    };
  }
  uploadscorecardNew(e: any, data: any, apiUrl: any) {
    let Token = localStorage.getItem("authenticationToken")
    this.retryText = false;
    let imageType = e.srcElement.files[0].type;
    let imageSize = e.srcElement.files[0].size;
    let isValidResponse = this.isValidImageFile(imageType, imageSize, e.srcElement.files[0].name);
    if (isValidResponse.isValid === false) {
      e.srcElement.files[0].value = '';
    } else {
      let uploadForm = new FormData();

      uploadForm.append('scoreCardfile', e.srcElement.files[0]);
      uploadForm.append('auditId', data.auditId);
      uploadForm.append('userName', this.ngxservice.userId.toString());

      this.http.post(apiUrl, uploadForm, {
        headers: {Authorization: 'Bearer '+Token },
        reportProgress: true,
        observe: "events"
      })
        .pipe(
          map((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.smallShimmer = true;
              this.retryText = false;
            } else if (event.type == HttpEventType.Response) {
              if (event.body.payLoad) {
                let storeCode = event.body.payLoad.storeCode;
                let storeIndex = this.tableData.data.findIndex((value: any) => {
                  return value.storeCode == storeCode;
                });
                this.tableData.data[storeIndex].scoreCardUpdateByName = event.body.payLoad.scoreCardUpdateByName;
                this.tableData.data[storeIndex].scoreCardUpdatedAt = event.body.payLoad.scoreCardUpdatedAt;
                this.tableData.data[storeIndex].scoreCardUpdateBy = event.body.payLoad.scoreCardUpdateBy;
                this.tableData.data[storeIndex].scoreCardFiles = event.body.payLoad.scoreCardFiles;
                this.tableData.data[storeIndex].scoreCardFileName = event.body.payLoad.scoreCardFileName;
                this.scorecardData.data = event.body.payLoad.auditScoreCardHistoryFileDTO;
                this.scorecardData.data.unshift(this.selectedscrecardData);
                this.tempscorecardData = this.scorecardData.data;
                this.activescorecard = 0;
                this.activescorecardData = this.scorecardData.data[this.activescorecard];
                this.scorecardpdfUrl = this.pdfPath + this.activescorecardData.scoreCardFiles; 
                this.smallShimmer = false;
                this.retryText = false;
                /* Assigned Manager Filter scorecard Table*/
                this.updateByNameDatascorecard = Array.from(new Set(this.scorecardData.data.filter(function (item: any) {
                  return item.scoreCardUpdateByName != '' && item.scoreCardUpdateByName != null;
                }).map((role: any) => role.scoreCardUpdateByName))).map(rl => {
                  return { name: rl, checked: false }
                });
               }
            }
          }),
          catchError((err: any) => {
            this.retryText = true
            this.isAlreadyFileUploadInProgress = false;
            return throwError(err.message);
          })
        )
        .toPromise();
    };
  }
  showscorecardFile(elem: any) {
    this.scorecardData.data = [];
    this.firstLoader = true;
    this.ngxService.start();
    this.pdfLoader = false;
    this.retryText = false;
    this.pdfHttpHeader = {
      Cookie: document.cookie,
      'sec-fetch-mode': 'no-cors'
    }
    this.selectedscrecardData = elem;
    this.scorecardView = true;
    let viewForm = {
      auditId: this.selectedscrecardData.auditId,
      userName: this.ngxservice.userId.toString()
    };
    this.http.post(this.utils.API.VIEW_SCORECARD_FILE, viewForm).subscribe((res: any) => {
      if (res.payLoad) {
        this.smallShimmer = true;
        this.scorecardData.data = res.payLoad.auditScoreCardHistoryFileDTO;
        this.scorecardData.data.unshift(this.selectedscrecardData);
        this.tempscorecardData = this.scorecardData.data;
        this.activescorecardData = this.scorecardData.data[this.activescorecard];
        this.scorecardpdfUrl = this.pdfPath + this.activescorecardData.scoreCardFiles;
        this.scorecardpdfUrlpreviousPdfurl = this.scorecardpdfUrl;
        /* Assigned Manager Filter History Table*/
        this.updateByNameDatascorecard = Array.from(new Set(this.scorecardData.data.filter(function (item: any) {
          return item.scoreCardUpdateByName != '' && item.scoreCardUpdateByName != null;
        }).map((role: any) => role.scoreCardUpdateByName))).map(rl => {
          return { name: rl, checked: false }
        });
      
        this.smallShimmer = false;
      }
    })
  }
  typeChangescorecard1(e:any){
    this.scorecardData.data = this.tempscorecardData;

    let updateByNameTypescorecard = this.updateByNameDatascorecard.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.name);

    let Tempscorecard: any = []
    for (let x of updateByNameTypescorecard) {
      let data = this.scorecardData.data.filter((item: any) => {
        return item.scoreCardUpdateByName == x;
      })
      for (let x of data) {
        Tempscorecard.push(x);
      }

    }

    if (updateByNameTypescorecard.length > 0) {
      this.scorecardData.data = Tempscorecard;
    }
    else {
      this.scorecardData.data = this.tempscorecardData;
    }
  }
  getscorecardelement(selectscorecard: any, n: any) {
    if (this.activescorecard !== n) {
      this.activescorecard = n;
      this.pdfLoader = true;
      this.activescorecardData = selectscorecard;
      this.scorecardpdfUrl = this.pdfPath + this.activescorecardData.scoreCardFiles;
      if (this.scorecardpdfUrlpreviousPdfurl == this.scorecardpdfUrl) {
        this.pdfLoader = false;
      }
      else {
        this.scorecardpdfUrlpreviousPdfurl = this.scorecardpdfUrl;
        this.pdfLoader = true;
      }
      this.firstLoader = false;
    }
  }
  sendMail1() {
    let param = {
      "year" : this.ngxservice.selectedYear,
      "storeCode": this.selectedscrecardData.storeCode,
      "emailId": this.Emails.toString(),
      "userName":this.username
    }
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.AUDIT_DOWNLIAD_FILE, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
      this.common.openSnackBar("Mail Sent Successfully", 2, "")
    });
    this.Emails = [];

  }
}
