import {
  Component,
  OnInit,
  Input,
  HostListener,
  ViewChild,ViewChildren,
  ChangeDetectorRef,OnDestroy,
  ChangeDetectionStrategy,QueryList,TemplateRef
} from "@angular/core";
import { IncidentService } from "../incident.service";
import { NavigationStart, Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../shared/services/incident-services/common.service";
import { RequestApiService } from "../../shared/services/incident-services/request-api.service";
import { DatePipe } from "@angular/common";
import { Utils } from "../../shared/incident-shared/module/utils";
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MatDialogConfig,
} from "@angular/material/dialog";
import { WitnessFormComponent } from "../witness-form/witness-form.component";
import * as _ from "lodash";
import { IncidentFormValidationService } from "../incident-form-validation.service";

import * as moment from "moment";
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-incident-create",
  templateUrl: "./incident-create.component.html",
  styleUrls: ["./incident-create.component.scss"]
})
export class IncidentCreateComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) autoCompleteTrigger: any;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) autoCompleteTrigger1: any;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) autoCompleteTrigger2: any;
  @ViewChildren(MatAutocompleteTrigger) autoCompleteTriggers:any;

  public scrollCount:number = 0;
  public closePanels() {
    if (this.autoCompleteTrigger.panelOpen) {
     this.autoCompleteTrigger.closePanel();
    }
    if (this.autoCompleteTrigger1.panelOpen) {
     this.autoCompleteTrigger1.closePanel();
    }
    if (this.autoCompleteTrigger2.panelOpen) {
     this.autoCompleteTrigger2.closePanel();
    }
  }
  // https://stackblitz.com/edit/angular-pvmarv-brpjsp?file=src%2Fapp%2Fautocomplete-overview-example.ts
  public closeAllPanels() {
    this.autoCompleteTriggers.forEach((trigger:any) => {
      if (trigger.panelOpen) {
      trigger.closePanel();
      }
    });
  }

  @HostListener("window:beforeunload", ["$event"])
  onBeforeUnload(event: any) {
    event.preventDefault();
    event.returnValue = "Your data will be lost!";
    if(this.incidentData.isAdd || this.incidentForm.value.incidentStatus=='Draft'){
        this.onSaveDraft(2);
    }
   if(!this.incidentData.isAdd){
   	//this.releaseIncidentLock();
   }

    localStorage.setItem("currentIncident", JSON.stringify(this.incidentData));
    return false;
  }
  @HostListener('window:scroll', ['$event']) onScrollEvent($event:any){
    let className:any=document.getElementsByClassName('bs-datepicker');
    let eventDate:any=document.getElementById('eventDate');
    this.closebsValue()
    let autoClickButton:any
    autoClickButton = document.getElementById('MainContent');
    const event1 = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    });
    autoClickButton.dispatchEvent(event1);
    const event = new KeyboardEvent("keypress",{
    'key': 'Escape'
    });
    document.dispatchEvent(event);
    this.closeAllPanels();
    this.scrollCount=this.scrollCount+1;
  }
  scrolling(e:any){
    this.closebsValue()
    let autoClickButton:any
    autoClickButton = document.getElementById('MainContent');
    const event1 = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    autoClickButton.dispatchEvent(event1);

    const event = new KeyboardEvent("keypress",{
     'key': 'Escape'
     });
     document.dispatchEvent(event);
     let autoCompleteTrigger:any=document.getElementById('autoCompleteTrigger');
     //autoCompleteTrigger.closePanel();
     this.scrollCount=this.scrollCount+1;

  }
  //className.css({"display:none"});
  //className.addClass('alpha');
  public tableHistoryColumns:any = [];
  public incidentEditData:any;
  public asigneesData: any = [];
  showMoreCommentCount = 1;
  isShowWitnessAvailable: boolean = true;
  incidentSubscription: any;
  productIdData: any;
  productDescriptionData: any;
  public dateOfAdult: any = "";
  incidentSelectedTypeData: any;
  incidentData: any;
  isPersonalInfoFormHidden: boolean = true;
  isPersonalInfoViewHidden: boolean = true;
  isIncidentDetailsFormHidden: boolean = true;
  isIncidentDetailsViewHidden: boolean = true;
  isSubmitEnableHidden: boolean = true;
  isSubmitDisableHidden: boolean = false;
  isDeleteEnableHidden: boolean = true;
  isDeleteDisableHidden: boolean = false;
  isProductDetailsFormHidden: boolean = true;
  isProductDetailsViewHidden: boolean = true;
  isSubmitEnable = false;
  formSubmitAttempt: boolean = false;
  isIncidentClosed:boolean = false;
  public ageTypeLabel = "";
  public fileInPutData: any;
  public personAge: number = 0;
  public ageMessage: string = "";
  public proofOfPurchaseFileInPutData: any = {};
  public allowedProofOfPurchaseFile = [
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  ];
  public allowedFileProofType = [
  "image/jpeg",
  "image/jpg",
  "video/mp4",
  "video/mov",
  "video/wmv",
  "video/webm",
  ];
  incidentFormAccess: any = {
  customer: {},
  employee: {},
  contractor: {},
  product: {},
  };
  public storeData: any = [];
  public priorityData: any = [];
  public natureOfProductFaultData: any = [];
  public incidentForm: any;
  public formFieldAccess: any = {};
  public witnessDataList: any;
  public witnessInputData: any = {
  id: 0,
  witnessName: "",
  witnessContactNumber: "",
  witnessContactEmail: "",
  witnessAddress: "",
  witnessStatement: "",
  witnessUnwillingToInvolve: false,
  witnessDeleted:0,
  formFieldAccess:this.formFieldAccess,
  toolTipData:{},
  uniqueId:0,
  witnessFiles:[],
  alreadyAddedData:[],
  isAddEdit:1
  };
  loginEmployeeCountry:any;
  loginEmployeeRegion:any
  public viewEvidenceData = [];
  public viewProofData = [];
  public isDraft: any = false;
  public toolTipData: any;
  public deleteType = "";
  currentIndex: number = 0;
  basicInfoViewData: any = {
  incidentForm: {},
  formFieldAccess: {},
  access: "All",
  showData: {
  createdBy: "",
  status: "",
  date: "",
  injured: "",
  store: "",
  versionDate: "",
  versionSavedUser: "",
  },redactRuleData:{},
  isHistory:false,
  incidentEditData:{}
  };
  personalInfoView: any = { incidentForm: {}, formFieldAccess: {},showData:{injuredPersonFullName:'',
  ageType:'',
  ageValue:'',
  calculatedAge:'',
  appropriateAge:'',
  injuredPersonContactNumber:'',
  injuredPersonEmail:'',
  parantsContactNo:'',
  injuredPersonAddress:'',
  store:'',
  significantOthers:'',createdOn:''},redactRuleData:{} };
  productDetailsView: any = { incidentForm: {}, formFieldAccess: {},showData:{},redactRuleData:{} };
  legalInfoFormData: any = {
  incidentForm: {},
  formFieldAccess: {},
  toolTipData: {},
  };
  insuranceVerificationData: any = {
  incidentForm: {},
  formFieldAccess: {},
  toolTipData: {},
  showData:{}
  };
  focusStyle: any = { border: "1px solid red" };
  public isAssginHandlingShow:boolean = false;
  public incidentViewData: any = {
  viewEvidenceData: [],
  incidentForm: {},
  formFieldAccess: {},
  showData:{eventActualDate:'',
  IsAprroximate:'',
  eventReportedDate:'',
  storeComments:'',
  injurySustained:'',
  circumstances:'',
  witnessAvailable:'',
  witnessList:'',
  evidenceAvailable:'',
  evidenceTakenBy:'',
  evidences:'',
  otherComments:'',createdOn:''},redactRuleData:{}
  };
  selectedUsers: any = new Array<any>();
  isShowInsuranceVerification:boolean = false;
  filteredUsers: any;
  lastFilter: string = "";
  isLegalInfoBoxShow:boolean=false;
  public incidentMinDate: any;
  public incidentMaxDate: any;
  public reportedMinDate: any;
  public reportedMaxDate: any;
  public productReturnToStoreMinDate: any;
  public productReturnToStoreMaxDate: any;
  public productReturnToHeadOfficeMinDate: any;
  public productReturnToHeadOfficeMaxDate: any;
  public access: any = "All";
  public datePickerConfig = Object.assign(
  {},
  {
  containerClass: "theme-dark-blue",
  showWeekNumbers: true,
  minDate: new Date(2018, 0, 1),
  maxDate: new Date(2018, 11, 31),
  dateInputFormat: "DD/MM/YYYY",
  }
  );
  public handlingissuesFormHidden: boolean = false;
  public handlingissuesViewHidden: boolean = true;
  public issuesHandlingViewData: any = {
  incidentForm:{},
  formFieldAccess:{},
  showData:{csdNumber:'',handlingTeams:[],formType:''},redactRuleData:{}
  };
  public insuranceVerificationViewData: any = {
  incidentForm: {},
  formFieldAccess: {},
  showData:{csdNumber:'',handlingTeams:[]},redactRuleData:{}
  };
  public showBasicInfoView:boolean = false;
  public loginEmployeeRoleCode:any;
  public historyTableDisplayColumns:any = [];
  isShowTable = false;
  public historyTableData:any = {columns:[],showColumn:[],data:[],redactRuleData:{}};
  public priorityTableData:any = {columns:[],showColumn:[],data:[],redactRuleData:{}};
  public retectedRuleData:any;
  tablePriorityColumns:any = [];
  priorityTableDisplayColumns:any = [];
  public mainContentShow:boolean = false;
  autocompletePosition: 'above' | 'below' = 'below'; // Set position here
  public isActionTakenBoxShow = false;
  loginEmployeeId: any;
  isStoreDisable = false;
  tableHistoryData:any = [];
  bsConfigValue = 1
  username:any
  public isDownload:boolean =false;
constructor(
    public incidentService: IncidentService,
    private router: Router,
    private fb: FormBuilder,
    public common: CommonService,
    public requestapi: RequestApiService,
    private datepipe: DatePipe,
    public utils: Utils,
    private dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private validation: IncidentFormValidationService, private ngxService: NgxUiLoaderService
  ) {}
  
  ngOnInit(): void {
    
     let userDetails = JSON.parse(localStorage.getItem('userDetails'));
this.username = localStorage.getItem('username');
this.loginEmployeeId = userDetails.employeeId;
    this.loginEmployeeCountry = userDetails.country;
    this.loginEmployeeRegion = userDetails.region;
    this.loginEmployeeRoleCode = userDetails.roleCode;
    this.tableHistoryColumns=this.utils.TABLE_HEADERS.INCIDENT_HISTORY_TABLE;
    this.historyTableDisplayColumns=this.tableHistoryColumns.map((col:any)=>col.indexName);

    this.tablePriorityColumns=this.utils.TABLE_HEADERS.PRIORITY_TABLE;
    this.priorityTableDisplayColumns=this.tablePriorityColumns.map((col:any)=>col.indexName);
  this.getFormFieldDescription();
   this.getRetectedRoleMapInfo();
    this.setMinMaxDate();
this.getAssigneesGenericList();
    this.incidentForm = this.fb.group({
      id: 0,
      injuredPersonFullName: [
        "",
        Validators.compose([Validators.required, this.validation.nameValidate]),
      ],
      ageType: [
        "Year",
        Validators.compose([
          Validators.required,
          this.validation.ageTypeValidate,
        ]),
      ],
      ageValue: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.ageValueValidate,
        ]),
      ],
      calculatedAge: [0],
      appropriateAge: [false],
      injuredPersonContactNumber: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.contactNumberValidate,
        ]),
      ],
      injuredPersonEmail: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.emailValidate,
        ]),
      ],
      parantsContactNo: [""],
      injuredPersonAddress: ["", Validators.compose([Validators.required])],
      store: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.storeValidate,
        ]),
      ],
      significantOthers: [
        "",
        Validators.compose([this.validation.significantNameValidate]),
      ],
      eventDate: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.incidentDateValidate,
        ]),
      ],
      eventTime: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.incidentTimeValidate,
        ]),
      ],
      eventActualDate: [null],
      approximateDate: [false],
      reportedDate: ["", Validators.compose([Validators.required,this.validation.reportedDateValidate])],
      reportedTime: [
        "",
        Validators.compose([Validators.required,this.validation.reportedTimeValidate]),
      ],
      eventReportedDate: [null],
      storeComments: ["", Validators.compose([Validators.required])],
      injurySustained: ["", Validators.compose([Validators.required,this.validation.injurysustainValidate])],
      injuryCircumstances: ["", Validators.compose([Validators.required,this.validation.circumstanceValidate])],
      witnessAvailable: ["", Validators.compose([Validators.required,this.validation.witnessAvailableValidate])],
      productIDView: [""],
      productDescriptionView: [""],
      productREcommentedAgeView: [""],
      evidenceAvailable: ["", Validators.compose([Validators.required,this.validation.evidenceAvailableValidate])],
      evidenceTakenBy: [""],
      evidences: [[]],
      otherComments: [""],
      priorityCode: ["", Validators.compose([Validators.required,this.validation.priorityValidate])],
      csdNumber: ["",Validators.compose([Validators.required,this.validation.csdnumberValidate
        ])],
      complainant:[""],
      productComplaint: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.complainantValidate,
        ]),
      ],
      articleId: [""],
      productId: [
        "",
        Validators.compose([
          Validators.required,
          this.validation.productIDValidate,
        ]),
      ],
      productDescription: ["", Validators.compose([Validators.required])],
      recommendedAge: [""],
      childRecommendedAge: [""],
      batchNo: [""],
      productReturnToStore: [""],
      productReturnToHeadOffice: [""],
      productAge: ["",Validators.compose([Validators.required,this.validation.productAgeValidate ])],
      proofOfPurchaseFilePath: [""],
      problemReportedBefore: ["",Validators.compose([Validators.required,this.validation.problemreportedbeforeValidate ])],
      faultCode: ["",Validators.compose([Validators.required,this.validation.faultCodeValidate])],
      productCircumstances: [""],
      witnessList: this.fb.array([]),
      createdByRole: [""],
      incidentCountry: [""],
      incidentRegion: [""],
      createdBy: [this.username],
      // employeeId: [this.loginEmployeeId],
      userName: [this.username],
      incidentType: [""],
      incidentId: [""],
      storeName: [""],
      resolveActions: [[]],
      goodWillGuster: [""],
      actionTakenToResolve: [""],
      assigneeSearchValue: [""],
      handlingTeams: [[],Validators.compose([Validators.required,this.validation.handlingTeamValidate])],
      initials: [""],
      severity: [""],
      preventability: [""],
      legalStatus: [""],
      claimReference: [""],
      claimDate: [""],
      cctvStatusCode: [""],
      photoStatusCode: [""],
      deleteDate: [""],
      incidentPrimaryCode: [""],
      incidentSecondaryCode: [""],
      actoinTakenComment:[""],
      productAgeType:["",Validators.compose([Validators.required,this.validation.productAgeTypeValidate ])],
      followUpCall:[""],
      noFootageAvailable:[""]
    });

    this.witnessDataList = this.incidentForm.get("witnessList") as FormArray;
    this.toolTipData = this.utils.tooltipMessage.toolTipData;
    this.formFieldAccess = this.utils.formAccess.allFormAccess;
    let currentIncident = localStorage.getItem("currentIncident");
    console.log(currentIncident,"currentIncident");
    if (
      currentIncident != "" &&
      currentIncident != null &&
      currentIncident != undefined &&
      currentIncident != "undefined"
    ) {
      this.incidentSelectedTypeData =
        JSON.parse(currentIncident).incidentSelectedTypeData;
      this.incidentData = JSON.parse(currentIncident);
      this.incidentService.subject$.next(this.incidentData);
    }
    this.incidentSubscription = this.incidentService.subject$.subscribe(
      (val: any) => {
        this.incidentData = val; console.log(this.incidentData,"this.incidentData");
        this.incidentSelectedTypeData =
          this.incidentData.incidentSelectedTypeData;

        if (this.incidentData.isAdd == false) {
           this.ngxService.start();
          this.getFieldAccessData();
          let idIncident = (this.incidentData.incidentRowData.incidentStatus=='Draft')?this.incidentData.id:this.incidentData.idIncident;
          this.getIncidentDetailsByIncidentID(this.incidentData.id);
 console.log(this.incidentSelectedTypeData,"this.incidentSelectedTypeData");
         

        } else {
          console.log(this.incidentSelectedTypeData,"this.incidentSelectedTypeData");
          this.getFieldAccessData();
          this.isPersonalInfoViewHidden = true;
          this.isPersonalInfoFormHidden = false;
          this.isIncidentDetailsViewHidden = true;
          this.isIncidentDetailsFormHidden = false;
          if (this.incidentSelectedTypeData.name == "Product") {
            this.isProductDetailsFormHidden = false;
            this.isProductDetailsViewHidden = true;
          }
          this.handlingissuesFormHidden = false;
          this.handlingissuesViewHidden = true;
          this.mainContentShow = true;
        }
        //this.cdref.detectChanges();
        localStorage.removeItem("currentIncident");
      },
      (err) => console.error("Sub1 " + err),
      () => console.log("Sub1 Complete")
    );
 console.log(this.incidentSelectedTypeData,"this.incidentSelectedTypeData");
       if(this.incidentSelectedTypeData!=undefined){
          if (this.incidentSelectedTypeData.name == "Customer") {
      this.incidentFormAccess.customer =
        this.utils.formAccess.customerFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId: '',
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldEvidenceData:[],
        isAdd:true
      };
      for (let x in this.formFieldAccess) {
        const hasKey = x in this.incidentFormAccess.customer;
        if (hasKey) {
          this.formFieldAccess[x] = this.incidentFormAccess.customer[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Employee") {
      this.incidentFormAccess.employee =
        this.utils.formAccess.employeeFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId: '',
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldEvidenceData:[],
        isAdd:true
      };
      for (let x in this.formFieldAccess) {
        const hasKey = x in this.incidentFormAccess.employee;
        if (hasKey) {
          this.formFieldAccess[x] = this.incidentFormAccess.employee[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Contractor") {
      this.incidentFormAccess.contractor =
        this.utils.formAccess.contractorFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId: '',
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldEvidenceData:[],
        isAdd:true
      };

      for (let x in this.formFieldAccess) {
        const hasKey = x in this.incidentFormAccess.contractor;
        if (hasKey) {
          this.formFieldAccess[x] = this.incidentFormAccess.contractor[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Product") {
      this.incidentFormAccess.product = this.utils.formAccess.productFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId: '',
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldEvidenceData:[],
        isAdd:true
      };
      this.proofOfPurchaseFileInPutData = {
        allowedFileType: this.allowedProofOfPurchaseFile,
        isEvidence: false,
        incidentId: '',
        fileTypeMessage: "pdf,jpg,jpeg",
        oldEvidenceData:[],
        isAdd:true
      };
      for (let x in this.formFieldAccess) {
        const hasKey = x in this.incidentFormAccess.product;
        if (hasKey) {
          this.formFieldAccess[x] = this.incidentFormAccess.product[x];
        }
      }
    }
    this.incidentForm.patchValue({
      incidentType: this.incidentSelectedTypeData.name.toLowerCase(),
    });  
       } 
    
	//this.getFieldAccessData();
	this.getToolTipData();
	this.getStoreList();
	this.getpriorityList();
	this.getnatureOfProductFaultList();
  
    let evidenceAvailable = <FormControl>(
      this.incidentForm.get("evidenceAvailable")
    );
    let evidences = <FormControl>this.incidentForm.get("evidences");
    let evidenceTakenBy = <FormControl>this.incidentForm.get("evidenceTakenBy");

    let subscription = evidenceAvailable.valueChanges.subscribe((value) => {
      if (value == true) {
        evidences.setValidators([this.validation.evidenceValidate]);
        evidenceTakenBy.setValidators([
          this.validation.evidenceTakenByNameValidate,
        ]);
      } else {
        evidences.setValidators(null);
        evidenceTakenBy.setValidators(null);
      }

      evidences.updateValueAndValidity();
      evidenceTakenBy.updateValueAndValidity();
    });

    const witnessAvailable = <FormControl>(
      this.incidentForm.get("witnessAvailable")
    );
    const witnessList = <FormControl>this.incidentForm.get("witnessList");

    let subscription2 = witnessAvailable.valueChanges.subscribe((value) => {
      if (value == true) {
        witnessList.setValidators([Validators.required]);
      } else {
        witnessList.setValidators(null);
      }

      witnessList.updateValueAndValidity();
    });
    this.setAuthAccess();
  }

  closebsValue(){
    var nodes = document.getElementsByTagName('bs-datepicker-container');
    for (var i = 0, len = nodes.length; i != len; ++i) {
        nodes[0]?.parentNode?.removeChild(nodes[0]);
    }
  }

  get witnessFormGroup() {
    return this.incidentForm.get("witnessList") as FormArray;
  }
  createWitness(
    id: number,
    witnessName: string,
    witnessContactNumber: string,
    witnessContactEmail: string,
    witnessAddress: string,
    witnessStatement: string,
    witnessUnwillingToInvolve: boolean,
    witnessDeleted:number,
    uniqueId:number,
    witnessFiles:any
  ): FormGroup {
    return this.fb.group({
      id: [id],
      witnessName: [witnessName, Validators.compose([Validators.required])],
      witnessContactNumber: [
        witnessContactNumber,
        Validators.compose([Validators.required]),
      ],
      witnessContactEmail: [
        witnessContactEmail
      ],
      witnessAddress: [
        witnessAddress      ],
      witnessStatement: [
        witnessStatement
      ],
      witnessUnwillingToInvolve: [
        witnessUnwillingToInvolve,
        Validators.compose([Validators.required]),
      ],
      witnessDeleted:[witnessDeleted],
      uniqueId:[uniqueId],
      witnessFiles:[witnessFiles]
    });
  }
  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }
  addWitness(
    id: number,
    witnessName: string,
    witnessContactNumber: string,
    witnessContactEmail: string,
    witnessAddress: string,
    witnessStatement: string,
    witnessUnwillingToInvolve: boolean,
    witnessDeleted:number,
    uniqueId:number,
    witnessFiles:any
  ) {
    this.witnessDataList = this.incidentForm.get("witnessList") as FormArray;
    // this.witnessDataList.status == 'VALID'
    if (witnessName != "" && witnessName != null) {
      this.witnessDataList.push(
        this.createWitness(
          id,
          witnessName,
          witnessContactNumber,
          witnessContactEmail,
          witnessAddress,
          witnessStatement,
          witnessUnwillingToInvolve,
          witnessDeleted,
          uniqueId,
          witnessFiles
        )
      );
    } else {
      this.common.openSnackBar(
        "Please fill the witness details",
        2,
        "Required"
      );
    }
  }

  removeWitness(index: number) {
    this.witnessDataList.removeAt(index);
  }
 
  ngOnDestroy() {
    this.releaseIncidentLock();
    this.incidentSubscription.unsubscribe();
    let currentIncident = localStorage.getItem("currentIncident");
    console.log(currentIncident,"currentIncident");
    if (
      currentIncident != "" &&
      currentIncident != null &&
      currentIncident != undefined &&
      currentIncident != "undefined"
    ) {
      localStorage.removeItem("currentIncident");
    }
  }
  
  isAlreadyAddProcess = false;
 async addComment() {
    if (
      this.incidentForm.value.goodWillGuster == "" &&
      this.incidentForm.value.actionTakenToResolve == "" &&
      this.incidentForm.value.actoinTakenComment == ""
    ) {
    } else {
      let id = this.incidentForm.value.id;
      let data = {
        goodwill: this.incidentForm.value.goodWillGuster,
        resolveAction: this.incidentForm.value.actionTakenToResolve,
        comments: this.incidentForm.value.actoinTakenComment,
        addedDateTime: '',
        createdDate: '',
        createdByName: "",
          followUpCall:this.incidentForm.value.followUpCall,
        // id:this.incidentData.idIncident,
        incidentId: (this.incidentData.isAdd==false && this.incidentData.incidentRowData.incidentStatus!='Draft')?this.incidentData.id:id,
        createdBy:localStorage.getItem('username'),
        userName:localStorage.getItem('username')
      };
this.isAlreadyAddProcess = true;
let response: any = await this.requestapi.postData(
      this.utils.API.INCIDENT_ADD_COMMENTS,data);
    if (response) {
      let commentArray = response.payLoad;
      this.incidentData.incidentId = (this.incidentData.isAdd==false)?this.incidentEditData.incidentId:commentArray[0].incidentId;
      this.fileInPutData.incidentId=(this.incidentData.isAdd==false)?this.incidentData.idIncident:commentArray[0].incidentId;
      this.proofOfPurchaseFileInPutData.incidentId=(this.incidentData.isAdd==false)?this.incidentData.idIncident:commentArray[0].incidentId;
      this.incidentData.idIncident=(this.incidentData.isAdd==false)?this.incidentEditData.incidentId:commentArray[0].incidentId;
       
       this.incidentData.id=commentArray[0].incidentId;
       this.incidentForm.patchValue({
        id:(this.incidentData.isAdd==false)?this.incidentEditData.id:commentArray[0].incidentId,
        incidentId:(this.incidentData.isAdd==false)?this.incidentEditData.incidentId:commentArray[0].incidentId,
        goodWillGuster: "",
        actionTakenToResolve: "",
        actoinTakenComment: "",
        resolveActions:commentArray,
          followUpCall:"",
      });
       this.isAlreadyAddProcess = false;
    }
     // this.incidentForm.value.resolveActions.unshift(data);

    }
  }
  boxList: boolean = true;
  showMoreCmd() {
    this.boxList = false;
    this.showMoreCommentCount = this.incidentForm.value.resolveActions.length;
  }
  showLessCmd() {
    this.boxList = true;
    this.showMoreCommentCount = 1;
  }
  async getStoreList() {
    let response: any = await this.requestapi.getData(
      this.utils.API.STORE_LIST_URL + "?userName="+this.username
    );
    if (response) {
      this.storeData = response.payLoad;
      if(this.storeData.length==1){
      	if(this.incidentData.isAdd){
           this.incidentForm.patchValue({store:this.storeData[0].id});
        this.isStoreDisable = true;
        }

      }
    }
  }
  async getpriorityList() {
    let response: any = await this.requestapi.getData(
      this.utils.API.INCIDENT_PRIORITY_CODE_URL +
        "?userName="+this.username
    );
    if (response) {
      this.priorityData = response.payLoad;
      this.priorityTableData.data = this.priorityData;
      this.priorityTableData.columns = this.tablePriorityColumns;
       this.priorityTableData.showColumn = this.priorityTableDisplayColumns;

    }
  }
  async getnatureOfProductFaultList() {
    let response: any = await this.requestapi.getData(
      this.utils.API.PRODUCT_FAULT_CODE_URL +
        "?userName="+this.username
    );
    if (response) {
      this.natureOfProductFaultData = response.payLoad;
    }
  }
  assignChange(e: any) {
    //this.getAsigneesList(this.incidentForm.value.assigneeSearchValue);
    if(this.incidentForm.value.assigneeSearchValue!=null && this.incidentForm.value.assigneeSearchValue!=''){
        let val = this.incidentForm.value.assigneeSearchValue;
      this.assignGenericFilterData = this.assigneeGenericData.filter((item:any)=>{
          return item.emailAddress.includes(this.incidentForm.value.assigneeSearchValue);
        });
    }else{
      this.getAssigneesGenericList();
    }
     
  }
  // async getAsigneesList(searchValue: any) {
  //   let response: any = await this.requestapi.getData(
  //     this.utils.API.GET_ASSIGNEES_LIST +
  //       "?incidentType=" +
  //       this.incidentSelectedTypeData.name.toLowerCase() +
  //       "&searchText=" +
  //       searchValue+"&userName="+this.username
  //   );
  //   if (response) {
  //     this.asigneesData = response.payLoad;
  //     for(let x of this.asigneesData){
  //       let empid=x.employeeId;
  //       let empCheckedAlready = this.selectedUsers.filter(function(item:any){
  //         return item.employeeId==empid;
  //       });
  //       if(empCheckedAlready.length>0){
  //         x.selected = true;
  //       }
  //     }
  //   }
  // }

  async getToolTipData() {
    let response: any = await this.requestapi.getData(
      this.utils.API.INCIDENT_TOOLTIP_URL+'?userName='+this.username
    );
    if (response) {
      let tooltipData = response.payLoad;
     let data = JSON.parse(tooltipData[0].tooltipText);
     for(let x in data){
       this.toolTipData[x]=data[x];
     }
      // this.toolTipData = JSON.parse(tooltipData[0].tooltipText);
    }
  }
  async getFieldAccessData() {

    let requestParam = { roleName: this.loginEmployeeRoleCode, country: this.loginEmployeeCountry,userName:this.username };
    let response: any = await this.requestapi.getData(
      this.utils.API.INCIDENT_FIELD_ACCESS_URL + "?roleName="+this.loginEmployeeRoleCode+"&country="+this.loginEmployeeCountry+'&userName='+this.username);
    if (response) {
      let data = response.payLoad;
			let customerAccess = {};
			let employeeAccess = {};
			let contractorAccess = {};
			let productAccess = {};
      if(data.length>0){
      	for(let x of data){
      		if(x.formName=='customer'){
               customerAccess = JSON.parse(x.formFields);
      		}else if(x.formName=='contractor'){
               contractorAccess = JSON.parse(x.formFields);
      		}else if(x.formName=='employee'){
               employeeAccess = JSON.parse(x.formFields);
      		}else if(x.formName=='product'){
               productAccess = JSON.parse(x.formFields);
      		}
      	}
      }

      this.setFieldAccess(
        customerAccess,
        employeeAccess,
        contractorAccess,
        productAccess
      );
    }
  }
  setFieldAccess(
    customerAccess: any,
    employeeAccess: any,
    contractorAccess: any,
    productAccess: any
  ) {
    if (this.incidentSelectedTypeData.name == "Customer") {

      this.incidentFormAccess.customer =
        this.utils.formAccess.customerFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId: this.incidentData.id,
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldIncidentData:(!this.incidentData.isAdd && this.incidentEditData)?this.incidentEditData.evidences:[],
        isAdd:this.incidentData.isAdd,
        oldEvidenceData:[]
      };

      for (let x in this.formFieldAccess) {
        const hasKey = x in customerAccess;
        if (hasKey) {
          this.formFieldAccess[x] = customerAccess[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Employee") {

      this.incidentFormAccess.employee =
        this.utils.formAccess.employeeFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId: this.incidentData.id,
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldIncidentData:(!this.incidentData.isAdd  && this.incidentEditData)?this.incidentEditData.evidences:[],
        isAdd:this.incidentData.isAdd,
        oldEvidenceData:[]
      };
      for (let x in this.formFieldAccess) {
        const hasKey = x in employeeAccess;
        if (hasKey) {
          this.formFieldAccess[x] = employeeAccess[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Contractor") {

      this.incidentFormAccess.contractor =
        this.utils.formAccess.contractorFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId:this.incidentData.id,
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldIncidentData:(!this.incidentData.isAdd  && this.incidentEditData)?this.incidentEditData.evidences:[],
        isAdd:this.incidentData.isAdd,
        oldEvidenceData:[]
      };

      for (let x in this.formFieldAccess) {
        const hasKey = x in contractorAccess;
        if (hasKey) {
          this.formFieldAccess[x] = contractorAccess[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Product") {
      this.incidentFormAccess.product = this.utils.formAccess.productFormAccess;
      this.fileInPutData = {
        allowedFileType: this.allowedFileProofType,
        isEvidence: true,
        incidentId: this.incidentData.id,
        fileTypeMessage: "jpg,jpeg,mp4,mov,wmv,webm",
        oldIncidentData:(!this.incidentData.isAdd  && this.incidentEditData)?this.incidentEditData.evidences:[],
        isAdd:this.incidentData.isAdd,
        oldEvidenceData:[]
      };
      this.proofOfPurchaseFileInPutData = {
        allowedFileType: this.allowedProofOfPurchaseFile,
        isEvidence: false,
        incidentId: this.incidentData.id,
        fileTypeMessage: "pdf,jpg,jpeg",
        oldIncidentData:(!this.incidentData.isAdd  && this.incidentEditData)?this.incidentEditData.evidences:[],
        isAdd:this.incidentData.isAdd,
        oldEvidenceData:[]
      };
      for (let x in this.formFieldAccess) {
        const hasKey = x in productAccess;
        if (hasKey) {
          this.formFieldAccess[x] = productAccess[x];
        }
      }
    }
    this.isAssginHandlingShow = this.incidentService.isShowHandlingTeam(this.formFieldAccess)
if(this.incidentEditData){
   this.setFieldViewEditAccess();
}
if(this.formFieldAccess.downloadIncident.create || this.formFieldAccess.downloadIncident.write || this.formFieldAccess.downloadIncident.view){
   this.isDownload=true;
}
this.isActionTakenBoxShow = this.incidentService.isActionTakenBoxShow(this.formFieldAccess);
  }
  async onSubmit() {
    this.formSubmitAttempt = true;
    this.incidentForm.get('ageType').touched=true;
    this.incidentForm.get('evidenceTakenBy').touched=true;
    this.incidentForm.get('reportedDate').touched=true;
    this.incidentForm.get('reportedTime').touched=true;
    this.incidentForm.get('productId').touched=true;
    this.incidentForm.get('store').touched=(this.storeData.length==1 || (this.incidentForm.get('store').value!='' && this.incidentForm.get('store').value!=null))?true:false;
    if(this.incidentData.isAdd==false){
    this.setFormAutoTouched();
    }
   this.setHandlingTeam();
    if (
      this.incidentForm.value.eventDate != null &&
      this.incidentForm.value.eventDate != "" &&
      this.incidentForm.value.eventTime != "" &&
      this.incidentForm.value.eventTime != null
    ) {
      let actualDateString =
        moment(this.incidentForm.value.eventDate).format("YYYY-MM-DD") +
        " " +
        this.incidentForm.value.eventTime +
        ":00";
      this.incidentForm.patchValue({
        eventActualDate: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    } else if (
      this.incidentForm.value.eventDate != "" &&
      this.incidentForm.value.eventDate != null &&
      (this.incidentForm.value.eventTime == "" ||
        this.incidentForm.value.eventTime == null)
    ) {
      let actualDateString =
        moment(this.incidentForm.value.eventDate).format("YYYY-MM-DD") +
        " 00:00:00";
      this.incidentForm.patchValue({
        eventActualDate: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    } else if (
      (this.incidentForm.value.eventDate == "" ||
        this.incidentForm.value.eventDate == null) &&
      this.incidentForm.value.eventTime != ""
    ) {
      this.common.openSnackBar("Please select incident date", 2, "Required");
    }

    if (
      this.incidentForm.value.reportedDate != "" &&
      this.incidentForm.value.reportedDate != null &&
      this.incidentForm.value.reportedTime != "" &&
      this.incidentForm.value.reportedTime != null
    ) {
      let reportedDateString =
        moment(this.incidentForm.value.reportedDate).format("YYYY-MM-DD") +
        " " +
        this.incidentForm.value.reportedTime +
        ":00";
      this.incidentForm.patchValue({
        eventReportedDate: this.datepipe.transform(
          reportedDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    } else if (
      this.incidentForm.value.reportedDate != "" &&
      this.incidentForm.value.reportedDate != null &&
      (this.incidentForm.value.reportedTime == "" ||
        this.incidentForm.value.reportedTime == null)
    ) {
      let actualDateString =
        moment(this.incidentForm.value.reportedDate).format("YYYY-MM-DD") +
        " 00:00:00";
      this.incidentForm.patchValue({
        eventActualDate: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    } else if (
      (this.incidentForm.value.reportedDate == "" ||
        this.incidentForm.value.reportedDate == null) &&
      this.incidentForm.value.reportedTime != "" &&
      this.incidentForm.value.reportedTime != null
    ) {
      this.common.openSnackBar("Please select reported date", 2, "Required");
    }

    if (
      this.incidentForm.value.productReturnToStore != "" &&
      this.incidentForm.value.productReturnToStore != null
    ) {
      let actualDateString = moment(
        this.incidentForm.value.productReturnToStore
      ).format("YYYY-MM-DD");
      this.incidentForm.patchValue({
        productReturnToStore: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd"
        ),
      });
    }
    if (
      this.incidentForm.value.productReturnToHeadOffice != "" &&
      this.incidentForm.value.productReturnToHeadOffice != null
    ) {
      let actualDateString = moment(
        this.incidentForm.value.productReturnToHeadOffice
      ).format("YYYY-MM-DD");
      this.incidentForm.patchValue({
        productReturnToHeadOffice: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd"
        ),
      });
    }

    let isSave = false;
    if (
      this.incidentSelectedTypeData.name == "Customer" &&
      this.incidentForm["controls"].injuredPersonFullName.status == "VALID" &&
      this.incidentForm["controls"].ageType.status == "VALID" &&
      this.incidentForm["controls"].ageValue.status == "VALID" &&
      this.incidentForm["controls"].injuredPersonContactNumber.status ==
        "VALID" &&
      this.incidentForm["controls"].injuredPersonEmail.status == "VALID" &&
      this.incidentForm["controls"].store.status == "VALID"
    ) {
      isSave = true;
    } else if (
      this.incidentSelectedTypeData.name == "Contractor" &&
      this.incidentForm["controls"].injuredPersonFullName.status == "VALID" &&
      this.incidentForm["controls"].ageType.status == "VALID" &&
      this.incidentForm["controls"].ageValue.status == "VALID" &&
      this.incidentForm["controls"].injuredPersonContactNumber.status ==
        "VALID" &&
      this.incidentForm["controls"].injuredPersonEmail.status == "VALID" &&
      this.incidentForm["controls"].store.status == "VALID"
    ) {
      isSave = true;
    } else if (
      this.incidentSelectedTypeData.name == "Employee" &&
      this.incidentForm["controls"].injuredPersonFullName.status == "VALID" &&
      this.incidentForm["controls"].ageType.status == "VALID" &&
      this.incidentForm["controls"].ageValue.status == "VALID" &&
      this.incidentForm["controls"].injuredPersonContactNumber.status ==
        "VALID" &&
      this.incidentForm["controls"].injuredPersonEmail.status == "VALID" &&
      this.incidentForm["controls"].store.status == "VALID"
    ) {
      isSave = true;
    } else if (
      this.incidentSelectedTypeData.name == "Product" &&
      this.incidentForm["controls"].injuredPersonFullName.status == "VALID" &&
      this.incidentForm["controls"].ageType.status == "VALID" &&
      this.incidentForm["controls"].ageValue.status == "VALID" &&
      this.incidentForm["controls"].injuredPersonContactNumber.status ==
        "VALID" &&
      this.incidentForm["controls"].injuredPersonEmail.status == "VALID" &&
      this.incidentForm["controls"].store.status == "VALID" &&
      this.incidentForm["controls"].productComplaint.status == "VALID" &&
      this.incidentForm["controls"].productId.status == "VALID"
    ) {
      isSave = true;
    }
    let isValidForm = this.validation.validateSubmitIncident(
      this.incidentForm.value,
      this.incidentSelectedTypeData.name,this.loginEmployeeRoleCode
    );

    this.incidentForm.patchValue({complainant:this.incidentForm.value.productComplaint});
    let incidentStatus=(this.incidentData.isAdd == false)?this.incidentEditData.incidentStatus:'';
    if (isSave && isValidForm) {
      this.ngxService.start();
       this.formatWitnessDataBeforeUpdate();
      let finalFormData = this.incidentService.deleteUnwantedParam(this.incidentForm.value);

      let url =
        (this.incidentData.isAdd == true || incidentStatus=='Draft')
          ? this.utils.API.CREATE_INCIDENT_URL
          : this.utils.API.INCIDENT_UPDATE_URL;
      let response: any = await this.requestapi.postData(
        url,
        finalFormData
      );
      if (response) {
        let msg =
          this.incidentData.isAdd == true
            ? "Incident created successfully"
            : "Incident updated successfully";
        this.common.openSnackBar(msg, 1, "Success");
        this.ngxService.stop();
        this.router.navigate(["incident-list"]);
      }
    }
  }
  formatWitnessDataBeforeUpdate(){
    let witnessList = this.incidentForm.value.witnessList;
    if(witnessList.length>0){
      let finalData = []
      for(let x of witnessList){
        if(x.id==0 && x.witnessDeleted==1){
          // dont send not added db and deleted locally data
        }else {
        let witnessFiles=[];
        for(let y of x.witnessFiles){
          if(y.id==0 && y.witnessFileDeleted==1){
          // dont send not added db and deleted locally data
          }else{
            witnessFiles.push(y);
          }
        }

        let data={id:x.id,
        witnessName:x.witnessName,
        witnessContactNumber:x.witnessContactNumber,
        witnessAddress:x.witnessAddress,
        witnessStatement:x.witnessStatement,
        witnessContactEmail:x.witnessContactEmail,
        witnessUnwillingToInvolve:x.witnessUnwillingToInvolve,
        witnessDeleted:x.witnessDeleted,witnessFiles:witnessFiles}
        finalData.push(data);
      }

    }
     this.incidentForm.patchValue({witnessList:finalData});
      this.incidentForm.value.witnessList=finalData;
  }

  }
  gotToList() {
    this.router.navigate(["incident-list"]);
  }
  getUploadFile(file: any) {
    if (file.inputData.isEvidence == true) {
          this.incidentForm.patchValue({
          evidences: file.responsefile,
          // incidentId: file.incidentId,
          id:(this.incidentData.isAdd)?file.incidentId:this.incidentEditData.id
          });
          this.fileInPutData.incidentId = file.incidentId;
          this.proofOfPurchaseFileInPutData.incidentId = file.incidentId;
          this.viewEvidenceData = file.imageObject;
          this.viewProofData = file.imageObjectProof;
          //this.incidentData.idIncident = file.incidentId;
          this.fileInPutData.id = file.incidentId;
          this.proofOfPurchaseFileInPutData.id = file.incidentId;
    } else {
      this.incidentForm.patchValue({
        evidences: file.responsefile,
        // incidentId: file.incidentId,
        id:(this.incidentData.isAdd)?file.incidentId:this.incidentEditData.id
      });
      let proofData = file.responsefile.filter(function (item: any) {
        return item.isEvidence == false;
      });
      this.incidentForm.patchValue({
        proofOfPurchaseFilePath: proofData[0].evidenceFilePath,
       // incidentId: file.incidentId,
      });
      this.fileInPutData.incidentId = file.incidentId;
      this.proofOfPurchaseFileInPutData.incidentId = file.incidentId;
      this.viewEvidenceData = file.imageObject;
      this.viewProofData = file.imageObjectProof;
     // this.incidentData.idIncident = file.incidentId;
    }

  }
  ageTypeChange(e: any) {
    let ageType = e.srcElement.value;
    if (ageType == "Year") {
      this.ageTypeLabel = "Year";
    } else if (ageType == "Month") {
      this.ageTypeLabel = "Month";
    } else {
      this.ageTypeLabel = "";
    }
    this.calculateAge();
  }
  ageValueOnPress(e: any) {
    let keyAccessValid = this.common.allowNumberOnly(e);
    return keyAccessValid;
  }
  ageValueChange(e: any) {
    let val = e.srcElement.value;
    if (
      this.incidentForm.value.ageType == "Year" &&
      val != "" &&
      parseInt(val) < 18
    ) {
      this.ageMessage = "Minor";
      this.personAge = parseInt(val);
      let dt = new Date();
      let no_of_years = 18 - parseInt(val);
      dt.setFullYear(dt.getFullYear() + no_of_years);
      this.dateOfAdult = dt.toLocaleDateString();
    } else if (
      this.incidentForm.value.ageType == "Year" &&
      val != "" &&
      parseInt(val) >= 18
    ) {
      this.ageMessage = "Major";
      this.personAge = parseInt(val);
    } else if (
      this.incidentForm.value.ageType == "Month" &&
      val != "" &&
      parseInt(val) < 216
    ) {
      this.ageMessage = "Minor";
      this.personAge = parseFloat((parseInt(val) / 12).toFixed(2));
      let dt = new Date();
      let no_of_months = 216 - parseInt(val);
      this.dateOfAdult = dt.setMonth(dt.getMonth() + no_of_months);
      this.dateOfAdult = dt.toLocaleDateString();
    } else {
      this.ageMessage = "Major";
      this.personAge = parseFloat((parseInt(val) / 12).toFixed(2));
    }
    this.incidentForm.patchValue({ calculatedAge: this.personAge });
  }
  calculateAge() {
    if (
      this.incidentForm.value.ageType == "Year" &&
      this.incidentForm.value.ageValue != "" &&
      parseInt(this.incidentForm.value.ageValue) < 18
    ) {
      this.ageMessage = "Minor";
      this.personAge = parseInt(this.incidentForm.value.ageValue);
      let dt = new Date();
      let no_of_years = 18 - parseInt(this.incidentForm.value.ageValue);
      dt.setFullYear(dt.getFullYear() + no_of_years);
      this.dateOfAdult = dt.toLocaleDateString();
    } else if (
      this.incidentForm.value.ageType == "Year" &&
      this.incidentForm.value.ageValue != "" &&
      parseInt(this.incidentForm.value.ageValue) >= 18
    ) {
      this.ageMessage = "Major";
      this.personAge = parseInt(this.incidentForm.value.ageValue);
    } else if (
      this.incidentForm.value.ageType == "Month" &&
      this.incidentForm.value.ageValue != "" &&
      parseInt(this.incidentForm.value.ageValue) < 216
    ) {
      this.ageMessage = "Minor";
      this.personAge = parseFloat(
        (parseInt(this.incidentForm.value.ageValue) / 12).toFixed(2)
      );
      let dt = new Date();
      let no_of_months = 216 - parseInt(this.incidentForm.value.ageValue);
      this.dateOfAdult = dt.setMonth(dt.getMonth() + no_of_months);
      this.dateOfAdult = dt.toLocaleDateString();
    } else {
      this.ageMessage = "Major";
      this.personAge = parseFloat(
        (parseInt(this.incidentForm.value.ageValue) / 12).toFixed(2)
      );
    }
    this.incidentForm.patchValue({ calculatedAge: this.personAge,significantOthers:''  });
  }
  async getNatureOfProductFaultDropdown() {
    let response: any = await this.requestapi.getData(
      this.utils.API.PRODUCT_FAULT_CODE_URL
    );
    if (response) {
      this.natureOfProductFaultData = response.payLoad;
    }
  }
  async getPriorityCodeDropdown() {
    let response: any = await this.requestapi.getData(
      this.utils.API.INCIDENT_PRIORITY_CODE_URL
    );
    if (response) {
      this.priorityData = response.payLoad;
    }
  }
 
  openWitnessPopup(content: any, editOrAdd: number) {
    this.witnessInputData.formFieldAccess = this.formFieldAccess;
    this.witnessInputData.toolTipData = this.toolTipData;
    this.witnessInputData.witnessName='';
    this.witnessInputData.witnessAddress='';
    this.witnessInputData.witnessContactNumber='';
    this.witnessInputData.witnessStatement='';
    this.witnessInputData.alreadyAddedData=this.incidentForm.value.witnessList;
   this.witnessInputData.isAddEdit=editOrAdd;
    let witnessInputData = {
      alreadyAddedData: this.incidentForm.value.witnessList,
      data: this.witnessInputData,
    };
    let dialogConfig = new MatDialogConfig();
    dialogConfig={
      width: "600px",
      disableClose: true ,
      data: { isAddEdit: editOrAdd, data: witnessInputData },
    };
    let data = { isAddEdit: editOrAdd, data: witnessInputData };
    this.dialog.open(content, {
      width: "600px",
      disableClose: true ,
      data:data ,
    });
  }
  saveWitness(e: any) {
   let isValid =  this.incidentService.validateWitnessBeforeAddUpdate(e.witnessData);
   if(isValid){
      if (e.isSave) {
      let id = e.uniqueId > 0 ? e.uniqueId : this.incidentForm.value.witnessList.length + 1;
      this.addWitness(
        0,
        e.witnessData.witnessName,
        e.witnessData.witnessContactNumber,
        e.witnessData.witnessContactEmail,
        e.witnessData.witnessAddress,
        e.witnessData.witnessStatement,
        e.witnessData.witnessUnwillingToInvolve,
        e.witnessData.witnessDeleted,
        id,
        e.witnessData.witnessFiles
      );
    } else {
      this.incidentForm.get("witnessList").at(this.currentIndex).patchValue({
        id: e.witnessData.id,
        witnessName: e.witnessData.witnessName,
        witnessContactNumber: e.witnessData.witnessContactNumber,
        witnessContactEmail: e.witnessData.witnessContactEmail,
        witnessAddress: e.witnessData.witnessAddress,
        witnessStatement: e.witnessData.witnessStatement,
        witnessUnwillingToInvolve: e.witnessData.witnessUnwillingToInvolve,
        witnessDeleted:e.witnessData.witnessDeleted,
        uniqueId:e.witnessData.uniqueId,
        witnessFiles:e.witnessData.witnessFiles
      });
    }
   }

    //this.cdref.detectChanges();
    if (this.incidentForm.value.witnessList.length > 0) {
      this.isShowWitnessAvailable = false;
    }
  }
  getFaultDescriptionByCode(code: string) {
    let describtion = this.natureOfProductFaultData
      .filter(function (item: any) {
        return item.faultId == code;
      })
      .map((name: any) => name.faultDescription);
    return describtion;
  }
  async onSaveDraft(value: number) {
    this.setDateForm();
    this.setHandlingTeam();
     this.incidentForm.patchValue({complainant:this.incidentForm.value.productComplaint});
    if (this.validateDraftSave(value)) {
       this.ngxService.start();
      this.formatWitnessDataBeforeUpdate();
       let finalFormData = this.incidentService.deleteUnwantedParam(this.incidentForm.value);
      let response: any = await this.requestapi.postData(
        this.utils.API.SAVE_DRAFT_INCIDENT_URL,
        finalFormData
      );
      if (response) {
        this.incidentForm.patchValue({ incidentId: response.payLoad.id ,id: response.payLoad.id});
        this.common.openSnackBar(
          "Incident draft saved successfully",
          1,
          "Success"
        );
         this.ngxService.stop();
        //this.router.navigate(['incident-list']);
        this.isDraft = true;
        this.incidentData.id = response.payLoad.id;
        this.incidentData.idIncident = '';
        //this.incidentData.isAdd = false;
        localStorage.setItem("currentIncident", JSON.stringify(this.incidentData));
      }
    }
  }

  editWitness(content: any, index: number) {
    this.witnessInputData = this.incidentForm.value.witnessList[index];
    this.witnessInputData.toolTipData = this.toolTipData;
    this.witnessInputData.formFieldAccess = this.formFieldAccess;
     this.witnessInputData.alreadyAddedData=this.incidentForm.value.witnessList;
   this.witnessInputData.isAddEdit=2;
    let witnessInputData = {
      alreadyAddedData: this.incidentForm.value.witnessList,
      data: this.witnessInputData,
    };
    this.currentIndex = index;
    this.dialog.open(content, {
      width: "600px",
      disableClose: true ,
      data: { isAddEdit: 2, data: witnessInputData },
    });
  }

  deleteConfirmBox(content: any, index: number) {
    this.currentIndex = index;
    this.deleteType = "Witness";
    this.dialog.open(content, {
      width: "600px",
    });
  }
  deleteWitness() {
    this.removeWitness(this.currentIndex);

  }
  async productIDType(e: any) {
    if (this.incidentForm.value.productIDView.length >= 3) {
      let response: any = await this.requestapi.getData(
        this.utils.API.SEARCH_PRODUCT_DESCRIPTION_URL +
          "?searchText=" +
          this.incidentForm.value.productIDView+'&country='+this.loginEmployeeCountry+'&userName='+this.username
      );
      if (response) {
        this.productIdData = response.payLoad;
      }
    } else if (this.incidentForm.value.productIDView.length == 0) {
      this.productIdData = [];
      this.incidentForm.patchValue({
      productId: '',
      productDescription: '',
      recommendedAge: '',
      articleId: '',
      childRecommendedAge: '',
    });
    }
  }
  onProductIDSelectionChanged(e: any) {
    let selectedValue = e.option.value;
    let selectedData = this.productIdData.filter(function (item: any) {
      return item.articleId + "-" + item.articleDescription == selectedValue;
    });
    let articleDescription =
      selectedData.length > 0 ? selectedData[0].articleDescription : "";
    let recomentedAge =
      selectedData.length > 0 ? selectedData[0].ageSuitability : "";
    let productId = selectedData.length > 0 ? selectedData[0].articleId : "";
    this.incidentForm.patchValue({
      productId: productId,
      productDescription: articleDescription,
      recommendedAge: recomentedAge.toString().trim(),
      articleId: productId,
      childRecommendedAge: recomentedAge.toString().trim(),
    });
  }
 
  deleteDraftConform(content: any, type: any) {
    if (this.isDraft == true) {
      this.deleteType = type;
      this.dialog.open(content, {
        width: "600px",
      });
    } else {
      this.router.navigate(['/incident-list']);
    }
  }
  async deleteDraft() {
    let incidentId=(this.incidentForm.value.incidentId!=null)?
        this.incidentForm.value.incidentId:this.incidentForm.value.id;
    let response: any = await this.requestapi.postData(
      this.utils.API.DELETE_DRAFT_INCIDENT_URL +
        "?incidentId=" +incidentId+"&userName="+this.username,
      {}
    );
    if (response) {
      this.common.openSnackBar("Draft deleted successfully", 1, "Success");
      this.router.navigate(['incident-list'])
    }
  }
  deleteConfirmed() {
    if (this.deleteType == "Draft") {
      this.deleteDraft();
    } else if (this.deleteType == "Witness") {
       this.incidentForm.get('witnessList').at(this.currentIndex).patchValue({witnessDeleted:1})
    } else if (this.deleteType == "Assignee") {
      this.removeAssignee();
    }
  }
  getStoreNameById(id: any) {
    let storeName = this.storeData
      .filter(function (item: any) {
        return item.id == id;
      })
      .map((name: any) => name.storeDescription);
    return storeName;
  }
  get formIncidentControls(): any {
    return this.incidentForm["controls"];
  }
  isFieldValid(field: string) {
    return (
      (!this.incidentForm.get(field).valid &&
        this.incidentForm.get(field).touched) ||
      (this.incidentForm.get(field).untouched && this.formSubmitAttempt)
    );
  }

  users: any;
  filter(filter: string) {
    this.lastFilter = filter;
    if (filter) {
      return this.users.filter((option: any) => {
        return (
          option.firstname.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
          option.lastname.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        );
      });
    } else {
      return this.users.slice();
    }
  }

  displayFn(value: any) {
    let displayValue: string = "";
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.employeeName;
        } else {
          displayValue += ", " + user.employeeName;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }
  displayFnAssignHandle(value:any){
    let displayValue='';
    return displayValue;
  }

  optionClicked(event: Event, user: any) {
    event.stopPropagation();
    this.toggleSelection(event, user);
  }

  toggleSelection(e: any, user: any) {
    console.log(user,"user");
    if(user.isDeleteAccess==true){
         user.selected = !user.selected;
    if (user.selected) {
      let emailAddress=user.emailAddress;
      // let id = user.id;
      let isExistData=this.selectedUsers.filter(function(item:any){
        return item.emailAddress==emailAddress;
      })
      if(isExistData.length==0){
        user.createdOn='';
          this.selectedUsers.push(user);
      }

    } else {
      const i = this.selectedUsers.findIndex(
        (value: any) =>
          value.emailAddress === user.emailAddress
      );
      this.selectedUsers.splice(i, 1);
    }
    }
   
  }
  assigneeRemoveIndex = 0;
  currentAssignEmployeeID:any;
currentAssignGenericId:any;
  removeAssignConfirm(asnValue: any, content: any,index:number) {
    this.currentAssignEmployeeID = asnValue.emailAddress;
     let removedEmp = asnValue.emailAddress;
    let removeId = asnValue.id;
    let removeIndex = _.findIndex(this.assigneeGenericData, function (el: any) {
      return el.emailAddress == removedEmp;
    });
    this.assigneeRemoveIndex = (removeIndex>0)?removeIndex:index;
    this.deleteType = "Assignee";
    this.dialog.open(content, {
      width: "600px",
    });
  }
  removeAssignee() {
    let removedEmp = this.currentAssignEmployeeID;
     let removeIndex = _.findIndex(this.assigneeGenericData, function (el: any) {
      return el.emailAddress == removedEmp;
    });
   
      this.selectedUsers = this.selectedUsers.filter(function (item: any) {
      return item.emailAddress != removedEmp;
    });
      if(this.assigneeGenericData.length>0){
        this.assigneeGenericData[removeIndex].selected = false;
    }
  }
  incidentTimeKeyUp() {
    if (this.incidentForm.value.eventTime.length == 1) {
      if (this.incidentForm.value.eventTime.includes(":")) {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");

        this.incidentForm.patchValue({ eventTime: newTime });
      } else {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");

        this.incidentForm.patchValue({ eventTime: newTime });
      }
    } else if (
      this.incidentForm.value.eventTime.length == 2 &&
      !this.incidentForm.value.eventTime.includes(":")
    ) {
      let time = this.incidentForm.value.eventTime + ":";
      this.incidentForm.patchValue({ eventTime: time });
    } else if (this.incidentForm.value.eventTime.length == 3) {
      if (this.incidentForm.value.eventTime.includes(":")) {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":";
        this.incidentForm.patchValue({ eventTime: finalTime });
      } else {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 3);
        this.incidentForm.patchValue({ eventTime: finalTime });
      }
    } else if (this.incidentForm.value.eventTime.length == 4) {
      if (this.incidentForm.value.eventTime.includes(":")) {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 3);
        this.incidentForm.patchValue({ eventTime: finalTime });
      } else {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 4);
        this.incidentForm.patchValue({ eventTime: finalTime });
      }
    } else if (this.incidentForm.value.eventTime.length == 5) {
      if (this.incidentForm.value.eventTime.includes(":")) {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 4);
        this.incidentForm.patchValue({ eventTime: finalTime });
      } else {
        let newTime = this.incidentForm.value.eventTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 4);
        this.incidentForm.patchValue({ eventTime: finalTime });
      }
    }
  }
  reportedTimeKeyUp() {
    if (this.incidentForm.value.reportedTime.length == 1) {
      if (this.incidentForm.value.reportedTime.includes(":")) {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");

        this.incidentForm.patchValue({ reportedTime: newTime });
      } else {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");

        this.incidentForm.patchValue({ reportedTime: newTime });
      }
    } else if (
      this.incidentForm.value.reportedTime.length == 2 &&
      !this.incidentForm.value.reportedTime.includes(":")
    ) {
      let time = this.incidentForm.value.reportedTime + ":";
      this.incidentForm.patchValue({ reportedTime: time });
    } else if (this.incidentForm.value.reportedTime.length == 3) {
      if (this.incidentForm.value.reportedTime.includes(":")) {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":";
        this.incidentForm.patchValue({ reportedTime: finalTime });
      } else {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 3);
        this.incidentForm.patchValue({ reportedTime: finalTime });
      }
    } else if (this.incidentForm.value.reportedTime.length == 4) {
      if (this.incidentForm.value.reportedTime.includes(":")) {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 3);
        this.incidentForm.patchValue({ reportedTime: finalTime });
      } else {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 4);
        this.incidentForm.patchValue({ reportedTime: finalTime });
      }
    } else if (this.incidentForm.value.reportedTime.length == 5) {
      if (this.incidentForm.value.reportedTime.includes(":")) {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 4);
        this.incidentForm.patchValue({ reportedTime: finalTime });
      } else {
        let newTime = this.incidentForm.value.reportedTime
          .toString()
          .replace(":", "");
        let finalTime = newTime.slice(0, 2) + ":" + newTime.slice(2, 4);
        this.incidentForm.patchValue({ reportedTime: finalTime });
      }
    }
  }
  focusinmethod() {
    let b = document.body;
    b.style.overflow = "hidden";
  }
  focusoutmethod() {
    let b = document.body;
    b.style.overflow = "auto";
  }
 
  setMinMaxDate() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    var dd = currentDate.getDate().toString();
    var mm = (currentDate.getMonth() + 1).toString(); //January is 0!
    var yyyy = currentDate.getFullYear();
    if (parseInt(dd) < 10) {
      dd = "0" + dd;
    }

    if (parseInt(mm) < 10) {
      mm = "0" + mm;
    }
    this.incidentMaxDate = yyyy + "-" + mm + "-" + dd;
    this.reportedMinDate = yyyy - 20 + "-" + mm + "-" + dd;
    this.incidentMinDate = yyyy - 20 + "-" + mm + "-" + dd;
    this.reportedMinDate = yyyy - 20 + "-" + mm + "-" + dd;
    this.reportedMaxDate = yyyy + "-" + mm + "-" + dd;
    this.incidentMaxDate = new Date(this.incidentMaxDate);
    this.incidentMaxDate.setDate(this.incidentMaxDate.getDate());
    this.reportedMinDate = new Date(this.reportedMinDate);
   this.reportedMinDate.setDate(this.reportedMinDate.getDate());
    this.incidentMinDate = new Date(this.incidentMinDate);
    this.incidentMinDate.setDate(this.incidentMinDate.getDate());
    this.reportedMinDate = new Date(this.reportedMinDate);
    this.reportedMinDate.setDate(this.reportedMinDate.getDate());
    this.reportedMaxDate = new Date(this.reportedMaxDate);
    this.reportedMaxDate.setDate(this.reportedMaxDate.getDate());
    this.productReturnToStoreMinDate = yyyy - 20 + "-" + mm + "-" + dd;
    this.productReturnToStoreMaxDate = yyyy + "-" + mm + "-" + dd;
    this.productReturnToStoreMinDate = new Date(
      this.productReturnToStoreMinDate
    );
    this.productReturnToStoreMinDate.setDate(
      this.productReturnToStoreMinDate.getDate()
    );
    this.productReturnToStoreMaxDate = new Date(
      this.productReturnToStoreMaxDate
    );
    this.productReturnToStoreMaxDate.setDate(
      this.productReturnToStoreMaxDate.getDate()
    );

    this.productReturnToHeadOfficeMinDate = yyyy - 20 + "-" + mm + "-" + dd;
    this.productReturnToHeadOfficeMaxDate = yyyy + "-" + mm + "-" + dd;
    this.productReturnToHeadOfficeMinDate = new Date(
      this.productReturnToHeadOfficeMinDate
    );
    this.productReturnToHeadOfficeMinDate.setDate(
      this.productReturnToHeadOfficeMinDate.getDate()
    );
    this.productReturnToHeadOfficeMaxDate = new Date(
      this.productReturnToHeadOfficeMaxDate
    );
    this.productReturnToHeadOfficeMaxDate.setDate(
      this.productReturnToHeadOfficeMaxDate.getDate()
    );
  }
  validateDraftSave(value: any) {
    let formData = this.incidentForm.value;
    let totalEmptyField = 0;
    let isStore = true;
    let isName = true;
    for (let x in formData) {
      if (x == "store" && (formData[x] == "" || formData[x] == null)) {
        isStore = false;
        totalEmptyField = totalEmptyField + 1;
        break;
      }else if (x == "injuredPersonFullName" && (formData[x] == "" || formData[x] == null)) {
        isName = false;
        totalEmptyField = totalEmptyField + 1;
        break;
      } else if (formData[x] == "" || formData[x] == null) {
        totalEmptyField = totalEmptyField + 1;
      }
    }
    if (isStore == false || isName==false) {
      if (value == 1) {
        this.common.openSnackBar("Please fill minimum incident details to save as draft", 2, "Required");
      }
      return false;
    } else {
      return true;
    }
  }
  eventDateChange(e: any) {
    this.reportedMinDate = this.datepipe.transform(e, "yyyy-MM-dd");
    this.reportedMinDate = new Date(this.reportedMinDate);
    this.reportedMinDate.setDate(this.reportedMinDate.getDate());
    if(this.incidentData.isAdd==false){
      this.incidentForm.patchValue({reportedDate:this.incidentForm.value.reportedDate});
    }
  }
 

  productReturnToStoreChange(e: any) {
     this.productReturnToHeadOfficeMinDate = this.datepipe.transform(e, "yyyy-MM-dd");
    this.productReturnToHeadOfficeMinDate = new Date(this.productReturnToHeadOfficeMinDate);
    this.productReturnToHeadOfficeMinDate.setDate(this.productReturnToHeadOfficeMinDate.getDate());
  }
 
  async getIncidentDetailsByIncidentID(incidentId: any) {
    let response: any = await this.requestapi.getData(
      this.utils.API.GET_INCIDENT_DETAILS + "?id=" + incidentId+'&userName='+this.username
    );
    if (response) {
      let incidentData = response.payLoad;
      this.incidentEditData = incidentData; console.log(this.incidentEditData,"this.incidentEditData");
      this.fileInPutData.incidentId=this.incidentEditData.id;
       this.proofOfPurchaseFileInPutData.incidentId=this.incidentEditData.id;
        this.fileInPutData.oldEvidenceData=this.incidentEditData.evidences;
        this.fileInPutData.isAdd=false;
         this.proofOfPurchaseFileInPutData.isAdd=false;
    this.proofOfPurchaseFileInPutData.oldEvidenceData=this.incidentEditData.evidences;
      this.fileInPutData.responsefile = this.incidentEditData.evidences;
      this.fileInPutData.responsefile = this.incidentEditData.evidences;
      this.proofOfPurchaseFileInPutData.responsefile = this.incidentEditData.evidences;
       this.isDraft = (this.incidentEditData.incidentStatus=='Draft')?true:false;
         this.isIncidentRedected();
      this.setFormValue(incidentData);
      if(this.incidentEditData.incidentStatus!='Draft'){
        this.lockIncident(this.incidentEditData.id)
      }
      this.ngxService.stop();
      this.incidentData.incidentRowData = this.incidentEditData;
        }
  }
  setFormValue(data: any) {
      let eventDate=new Date(data.eventActualDate);
      eventDate.setDate(eventDate.getDate());
      let reportedDate=new Date(this.incidentEditData.eventReportedDate);
      reportedDate.setDate(reportedDate.getDate())
      let productReturnToHeadOffice:any;
      if(data.productReturnToHeadOffice!='' && data.productReturnToHeadOffice!=null){
      productReturnToHeadOffice =new Date(data.productReturnToHeadOffice);
      productReturnToHeadOffice.setDate(productReturnToHeadOffice.getDate());
      }else{
      productReturnToHeadOffice='';
      }
      let productReturnToStore:any;
      if(data.productReturnToStore!='' && data.productReturnToStore!=null){
      //  let productReturnToStore:any = this.datepipe.transform(data.productReturnToStore, "yyyy-MM-dd");
      productReturnToStore =new Date(data.productReturnToStore);
      productReturnToStore.setDate(productReturnToStore.getDate())
      }else{
      productReturnToStore='';
      }

      this.ageMessage = data.caseType;
      let fromPatchData = this.incidentService.setFormJson(data,this.incidentEditData,productReturnToStore,productReturnToHeadOffice,this.username,eventDate,reportedDate);
      this.incidentForm.patchValue(fromPatchData);
      let id = 0;
      this.isShowWitnessAvailable = data.witnessList.length > 0 ? false : true;
      for (let x of data.witnessList) {
      //id = id + 1;
      this.addWitness(
      x.id,
      x.witnessName,
      x.witnessContactNumber,
      x.witnessContactEmail,
      x.witnessAddress,
      x.witnessStatement,
      x.witnessUnwillingToInvolve,
      x.witnessDeleted,
      x.id,
      x.witnessFiles
      );
      }
      for (let ht of data.handlingTeams) {
        let idData = this.assigneeGenericData.filter(function(item:any){
          return item.emailAddress== ht.emailId
        }).map(item=>item.id)
      let htdata = {"id":(idData.length>0)?idData[0]:0,
   "roleName":"",
   "firstName":"",
   "lastName":"",
   "emailAddress":ht.emailId,
   "roleCode":"",
   "createdOn":ht.createdOn,
   "modifiedOn":"",
   "createdBy":null,
   "modifiedBy":null,
   "isActive":1,
   "selected":true,
   "isDeleteAccess":false
      };
      this.selectedUsers.push(htdata);
      }
      for(let x of this.assigneeGenericData){
        let exist = data.handlingTeams.filter(function(item:any){
         return item.emailId==x.emailAddress
        });
        if(exist.length>0){
          x.selected=true;
          x.isDeleteAccess=false;
        }
      }
      
      this.fileInPutData.oldEvidenceData=this.incidentEditData.evidences;
      this.proofOfPurchaseFileInPutData.oldEvidenceData=this.incidentEditData.evidences;
      this.access = localStorage.getItem("access");
      this.personalInfoView.incidentForm = this.incidentForm;
      this.personalInfoView.formFieldAccess = this.formFieldAccess;
      this.personalInfoView.redactRuleData = this.retectedRuleData;
      this.personalInfoView.showData = this.incidentService.getPersonalInfoViewData(this.isRedacted,this.incidentEditData);
      this.incidentViewData.incidentForm = this.incidentForm;
      this.incidentViewData.formFieldAccess = this.formFieldAccess;
      this.incidentViewData.redactRuleData = this.retectedRuleData;
      this.incidentViewData.showData = this.incidentService.getIncidentViewData(this.isRedacted,this.incidentEditData,this.incidentSelectedTypeData);
      this.productDetailsView.incidentForm = this.incidentForm;
      this.productDetailsView.formFieldAccess = this.formFieldAccess;
      this.productDetailsView.redactRuleData = this.retectedRuleData;
      this.productDetailsView.showData = this.incidentService.getProductViewData(this.isRedacted,this.incidentEditData);
      this.issuesHandlingViewData.incidentForm = this.incidentForm;
      this.issuesHandlingViewData.formFieldAccess = this.formFieldAccess;
      this.issuesHandlingViewData.showData = this.incidentService.getHandlingViewData(this.isRedacted,this.incidentSelectedTypeData,this.incidentEditData);
      this.issuesHandlingViewData.redactRuleData = this.retectedRuleData;
      this.legalInfoFormData.incidentForm = this.incidentForm;
      this.legalInfoFormData.formFieldAccess = this.formFieldAccess;
      this.legalInfoFormData.toolTipData = this.toolTipData;
      this.insuranceVerificationData.incidentForm = this.incidentForm;
      this.insuranceVerificationData.formFieldAccess = this.formFieldAccess;
      this.insuranceVerificationData.toolTipData = this.toolTipData;
      this.insuranceVerificationData.showData=this.incidentService.getInsuranceVerificationData(this.isRedacted,this.incidentEditData);
      this.basicInfoViewData.incidentForm = this.incidentForm;
      this.basicInfoViewData.formFieldAccess = this.formFieldAccess;
      let showBasicData = this.incidentService.getBasicInfoShowData(this.isRedacted,data,this.incidentEditData);
      this.basicInfoViewData.showData=showBasicData;
      this.basicInfoViewData.access = this.access;
      this.basicInfoViewData.redactRuleData = this.retectedRuleData;
      this.basicInfoViewData.incidentEditData = this.incidentEditData;
      this.insuranceVerificationViewData.incidentForm=this.incidentForm;
      this.insuranceVerificationViewData.formFieldAccess=this.formFieldAccess;
      this.insuranceVerificationViewData.toolTipData=this.toolTipData;
      this.insuranceVerificationViewData.showData=this.incidentService.getInsuranceverificationViewData(this.isRedacted,this.incidentEditData);
      this.showBasicInfoView = true;
      this.historyTableData.colums=this.utils.TABLE_HEADERS.INCIDENT_HISTORY_TABLE.map(name=>name.indexName);
      this.historyTableData.showColumn=this.utils.TABLE_HEADERS.INCIDENT_HISTORY_TABLE;
      this.historyTableData.data=this.incidentEditData.incidentVersionLists;
      let isPersonalInfoEdit=this.incidentService.isPersonalInfoEdit(this.formFieldAccess);
      this.isPersonalInfoViewHidden = (isPersonalInfoEdit)?true:false;
      this.isPersonalInfoFormHidden = (isPersonalInfoEdit)?false:true;
      let isIncidentDetailsEdit =this.incidentService.isIncidentDetailsEdit(this.formFieldAccess);
      this.isIncidentDetailsFormHidden = (isIncidentDetailsEdit)?false:true;
      this.isIncidentDetailsViewHidden =  (isIncidentDetailsEdit)?true:false;
      let isProductDetailsEdit =this.incidentService.isProductDetailsEdit(this.formFieldAccess);
      this.isProductDetailsFormHidden =  (isProductDetailsEdit)?false:true;
      this.isProductDetailsViewHidden = (isProductDetailsEdit)?true:false;
      let isHandlingEdit = this.incidentService.isHandlingEdit(this.formFieldAccess);
      this.isLegalInfoBoxShow = this.incidentService.isLegalBoxShow(this.formFieldAccess,this.loginEmployeeRoleCode,this.incidentEditData.evidenceAvailable);
      this.isShowInsuranceVerification=this.isLegalInfoBoxShow;
      this.handlingissuesViewHidden =  (isHandlingEdit)?true:false;
      this.handlingissuesFormHidden = (isHandlingEdit)?false:true;
      if(this.incidentData.isAdd==false && this.incidentEditData.incidentStatus=='Closed'){
      this.isIncidentClosed = true;
      this.isPersonalInfoViewHidden = false;
      this.isIncidentDetailsViewHidden =  false;
      this.isProductDetailsViewHidden = false;
      this.handlingissuesViewHidden =  false;
      this.isShowInsuranceVerification=false;
      this.isPersonalInfoFormHidden = true;
      this.isIncidentDetailsFormHidden = true;
      this.handlingissuesFormHidden = true;
      this.isProductDetailsFormHidden =  true;
      }
      this.optionData = (this.incidentEditData.priorityInfo!=null)?this.incidentEditData.priorityInfo.colorCode:'';
      this.mainContentShow = true;
       this.setAuthAccess();
  }

  setFieldViewEditAccess(){
     let isPersonalInfoEdit=this.incidentService.isPersonalInfoEdit(this.formFieldAccess);

     this.isPersonalInfoViewHidden = (isPersonalInfoEdit)?true:false;
     this.isPersonalInfoFormHidden = (isPersonalInfoEdit)?false:true;
     let isIncidentDetailsEdit =this.incidentService.isIncidentDetailsEdit(this.formFieldAccess);

    this.isIncidentDetailsFormHidden = (isIncidentDetailsEdit)?false:true;
    this.isIncidentDetailsViewHidden =  (isIncidentDetailsEdit)?true:false;
    let isProductDetailsEdit =this.incidentService.isProductDetailsEdit(this.formFieldAccess);

    this.isProductDetailsFormHidden =  (isProductDetailsEdit)?false:true;
     this.isProductDetailsViewHidden = (isProductDetailsEdit)?true:false;
     let isHandlingEdit = this.incidentService.isHandlingEdit(this.formFieldAccess);

     this.handlingissuesViewHidden =  (isHandlingEdit)?true:false;
     this.handlingissuesFormHidden = (isHandlingEdit)?false:true;
     this.isLegalInfoBoxShow = this.incidentService.isLegalBoxShow(this.formFieldAccess,this.loginEmployeeRoleCode,this.incidentEditData.evidenceAvailable);
this.isShowInsuranceVerification=this.isLegalInfoBoxShow;
     if(this.incidentData.isAdd==false && this.incidentEditData.incidentStatus=='Closed'){
        this.isIncidentClosed = true;
        this.isPersonalInfoViewHidden = false;
        this.isIncidentDetailsViewHidden =  false;
        this.isProductDetailsViewHidden = false;
        this.handlingissuesViewHidden =  false;
      this.isShowInsuranceVerification=false;
        this.isPersonalInfoFormHidden = true;
        this.isIncidentDetailsFormHidden = true;
        this.handlingissuesFormHidden = true;
        this.isProductDetailsFormHidden =  true;
     }

     this.setAuthAccess();


  }

  editHandlingIssues(data: any) {}
  saveInsuranceVerification(data: any) {
    this.incidentForm.patchValue({
      initials: data.initials,
      severity: data.severity,
      preventability: data.preventability,
      legalStatus: data.legalStatus,
      claimReference: data.claimReference,
      claimDate: data.claimDate,
      cctvStatusCode: data.cctvStatusCode,
      photoStatusCode: data.photoStatusCode,
      deleteDate: data.deleteDate,
      incidentPrimaryCode: data.incidentPrimaryCode,
      incidentSecondaryCode: data.incidentSecondaryCode,
    });
  }
  async releaseIncidentLock(){
    if(this.incidentData.isAdd==false){
        let incidentId= (this.incidentEditData && this.incidentEditData.incidentStatus!='Draft')?this.incidentEditData.id:this.incidentData.id;

        if(incidentId>0 && this.incidentEditData.incidentStatus!='Draft'){
        let param = {"incidentId":incidentId,"userName":this.username};
        let response: any = await this.requestapi.postData(this.utils.API.RELEASE_INCIDENT_LOCK,param);

        }
    }
  

  }
  redirectVersionHistory(rowData:any){
  }
  onHistoryClick(content:any){
  	 this.dialog.open(content, {
      width: "600px",
      // enterAnimationDuration: "100ms",
      // exitAnimationDuration: "1500ms",
    });
  	 this.isShowTable = true;
  }
 async  getRetectedRoleMapInfo(){
  	 let response: any = await this.requestapi.getData(this.utils.API.GET_ROLE_MAP_INFO_URL+'?roleName='+this.loginEmployeeRoleCode+'&country='+this.loginEmployeeCountry+'&userName='+this.username);
     if(response){
     	this.retectedRuleData = response.payLoad;
     }
  }
  async generatePDF(){
  	let response: any = await this.requestapi.getData(this.utils.API.GENERATE_PDF_URL+'?incidentId='+this.incidentEditData.incidentId+'&userName='+this.username+'&reportType=insurance'+'&userName='+this.username);
     if(response){
     	this.retectedRuleData = response.payLoad;
     }
  }

  setFormAutoTouched(){
this.incidentForm.get('injuredPersonFullName').touched=true;
this.incidentForm.get('ageType').touched=true;
this.incidentForm.get('ageValue').touched=true;
this.incidentForm.get('calculatedAge').touched=true;
this.incidentForm.get('appropriateAge').touched=true;
this.incidentForm.get('injuredPersonContactNumber').touched=true;
this.incidentForm.get('injuredPersonEmail').touched=true;
this.incidentForm.get('parantsContactNo').touched=true;
this.incidentForm.get('store').touched=true;
this.incidentForm.get('significantOthers').touched=true;
this.incidentForm.get('eventDate').touched=true;
this.incidentForm.get('eventTime').touched=true;
this.incidentForm.get('reportedDate').touched=true;
this.incidentForm.get('reportedTime').touched=true;
this.incidentForm.get('productIDView').touched=true;
this.incidentForm.get('productDescriptionView').touched=true;
this.incidentForm.get('productDescriptionView').touched=true;
this.incidentForm.get('complainant').touched=true;
this.incidentForm.get('productComplaint').touched=true;
this.incidentForm.get('injurySustained').touched=true;
this.incidentForm.get('injuryCircumstances').touched=true;
this.incidentForm.get('faultCode').touched=true;
this.incidentForm.get('problemReportedBefore').touched=true;
this.incidentForm.get('priorityCode').touched=true;
this.incidentForm.get('csdNumber').touched=true;
}

setDateForm(){
   if (
      this.incidentForm.value.eventDate != null &&
      this.incidentForm.value.eventDate != "" &&
      this.incidentForm.value.eventTime != "" &&
      this.incidentForm.value.eventTime != null
    ) {
      let actualDateString =
        moment(this.incidentForm.value.eventDate).format("YYYY-MM-DD") +
        " " +
        this.incidentForm.value.eventTime +
        ":00";
      this.incidentForm.patchValue({
        eventActualDate: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    } else if (
      this.incidentForm.value.eventDate != "" &&
      this.incidentForm.value.eventDate != null &&
      (this.incidentForm.value.eventTime == "" ||
        this.incidentForm.value.eventTime == null)
    ) {
      let actualDateString =
        moment(this.incidentForm.value.eventDate).format("YYYY-MM-DD") +
        " 00:00:00";
      this.incidentForm.patchValue({
        eventActualDate: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    } else if (
      (this.incidentForm.value.eventDate == "" ||
        this.incidentForm.value.eventDate == null) &&
      this.incidentForm.value.eventTime != ""
    ) {
      this.common.openSnackBar("Please select incident date", 2, "Required");
    }

    if (
      this.incidentForm.value.reportedDate != "" &&
      this.incidentForm.value.reportedDate != null &&
      this.incidentForm.value.reportedTime != "" &&
      this.incidentForm.value.reportedTime != null
    ) {
      let reportedDateString =
        moment(this.incidentForm.value.reportedDate).format("YYYY-MM-DD") +
        " " +
        this.incidentForm.value.reportedTime +
        ":00";
      this.incidentForm.patchValue({
        eventReportedDate: this.datepipe.transform(
          reportedDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    } else if (
      this.incidentForm.value.reportedDate != "" &&
      this.incidentForm.value.reportedDate != null &&
      (this.incidentForm.value.reportedTime == "" ||
        this.incidentForm.value.reportedTime == null)
    ) {
      let actualDateString =
        moment(this.incidentForm.value.reportedDate).format("YYYY-MM-DD") +
        " 00:00:00";
      this.incidentForm.patchValue({
        eventActualDate: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd h:mm:ss"
        ),
      });
    }
if (
      this.incidentForm.value.productReturnToStore != "" &&
      this.incidentForm.value.productReturnToStore != null
    ) {
      let actualDateString = moment(
        this.incidentForm.value.productReturnToStore
      ).format("YYYY-MM-DD");
      this.incidentForm.patchValue({
        productReturnToStore: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd"
        ),
      });
    }
    if (
      this.incidentForm.value.productReturnToHeadOffice != "" &&
      this.incidentForm.value.productReturnToHeadOffice != null
    ) {
      let actualDateString = moment(
        this.incidentForm.value.productReturnToHeadOffice
      ).format("YYYY-MM-DD");
      this.incidentForm.patchValue({
        productReturnToHeadOffice: this.datepipe.transform(
          actualDateString,
          "yyyy-MM-dd"
        ),
      });
    }

}
setHandlingTeam(){
   let handlingTeams = Array.from(
      new Set(this.selectedUsers.map((role: any) =>role.emailAddress))
    ).map((emailAddress:any) => {
      return {
        emailId: emailAddress,
        createdBy: this.loginEmployeeId
      };
    });
//    let handlingTeams=[];
// console.log(this.selectedUsers,"this.selectedUsers");
//   for(let x of this.selectedUsers){
//     let data = {assignedEmployeeId: x.username,
//     createdBy: this.loginEmployeeId,
//     genericTeamId:x.id
//     }
//     handlingTeams.push(data);
//   }
   console.log(handlingTeams,"handlingTeams");
    this.incidentForm.patchValue({ handlingTeams: handlingTeams });
}
isRedacted:boolean =false;
isIncidentRedected(){
  let redectedRule = (this.retectedRuleData)?this.retectedRuleData.redactRules:'No';
  if(redectedRule=='yes' && this.incidentData.isAdd==false){
    let createdOn = this.incidentEditData.createdOn;
   this.isRedacted=this.common.compareDateTwoMonthCompleted(createdOn);
  }
}

async csdNumberChange(e:any){
  let val = e.srcElement.value;
  if(val!='' && val!=null){
    let response:any=await this.requestapi.getData(this.utils.API.VALIDATE_CSD_NUMBER+'?csdNumber='+val+'&userName='+this.username);
   if(response){
     if(response.payLoad==true){
       this.common.openSnackBar('Required',2,"CSD number already exist");
     }
   }
  }
}
witnessAvailableChange(val:string){
  if(val=='N'){
    let witnessList = this.incidentForm.value.witnessList;
    for(let x=0;x<this.incidentForm.value.witnessList.length;x++){
       this.incidentForm.get('witnessList').at(x).patchValue({witnessDeleted:1})
    }

  }
}
evidenceAvailableChange(val:string){
  if(val=='N'){
    let evidences = this.incidentForm.value.evidences;
    for(let x=0;x<evidences.length;x++){
      evidences[x].evidenceDeleted=1;
    }
    this.incidentForm.patchValue({evidences:evidences,noFootageAvailable:"",evidenceTakenBy:""});

  }
this.fileInPutData.oldEvidenceData=this.incidentForm.value.evidences;
this.fileInPutData.responsefile=this.incidentForm.value.evidences;

}

saveLegalInfo(){
  this.onSubmit()
}
optionData = '';
optionClick(value:any){
  this.optionData = value;
}
isFieldValidHandlingTeam(control:any,controlSearchValue:any){
  return (
      (this.incidentForm.get(control).value.length==0 &&
        this.incidentForm.get(controlSearchValue).touched) ||
      (this.incidentForm.get(controlSearchValue).untouched && this.formSubmitAttempt)
    );
}

isEventTimeFieldValid(eventTimeControl:any,eventdateControl:any){
  if((this.incidentForm.get(eventdateControl).value!='' && this.incidentForm.get(eventdateControl).value!=null ) && (this.incidentForm.get(eventTimeControl).value!='' && this.incidentForm.get(eventTimeControl).value!=null )){
   return false
  }else{
    return (
     ((this.incidentForm.get(eventdateControl).value!='' && this.incidentForm.get(eventdateControl).value!=null ) &&
        this.incidentForm.get(eventTimeControl).touched) ||
      (this.incidentForm.get(eventTimeControl).untouched && this.formSubmitAttempt)
    ); 
  }
  

}
isReportedTimeFieldValid(reportedTimeControl:any,reporteddateControl:any){
  if((this.incidentForm.get(reporteddateControl).value!='' && this.incidentForm.get(reporteddateControl).value!=null ) && (this.incidentForm.get(reportedTimeControl).value!='' && this.incidentForm.get(reportedTimeControl).value!=null )){
   return false
  }else{
    return (
     ((this.incidentForm.get(reporteddateControl).value!='' && this.incidentForm.get(reporteddateControl).value!=null ) &&
        this.incidentForm.get(reportedTimeControl).touched) ||
      (this.incidentForm.get(reportedTimeControl).untouched && this.formSubmitAttempt)
    ); 
  }
  

}
isProductAgeTypeFieldValid(controlProductAgeType:any,controlproductAge:any){
   if((this.incidentForm.get(controlproductAge).value!='' && this.incidentForm.get(controlproductAge).value!=null ) && (this.incidentForm.get(controlProductAgeType).value!='' && this.incidentForm.get(controlProductAgeType).value!=null )){
   return false
  }else{
    return (
     ((!this.incidentForm.get(controlProductAgeType).valid &&  this.incidentForm.get(controlproductAge).value!='' && this.incidentForm.get(controlproductAge).value!=null  )) 
      || ( this.formSubmitAttempt)
    ); 
  }
  
}

setAuthAccess(){
  if(this.incidentService.isIncidentcreateAccess() || this.incidentService.isIncidentWriteAccess() || this.incidentService.isIncidentViewAccess()){
        if(this.incidentData!=undefined && this.incidentData.isAdd && this.incidentService.isIncidentcreateAccess()){

        }else if(this.incidentData!=undefined && !this.incidentData.isAdd && this.incidentService.isIncidentWriteAccess()){

        }else if(this.incidentData!=undefined && !this.incidentData.isAdd && this.incidentService.isIncidentViewAccess()){
              this.isIncidentClosed = true;
      this.isPersonalInfoViewHidden = false;
      this.isIncidentDetailsViewHidden =  false;
      this.isProductDetailsViewHidden = false;
      this.handlingissuesViewHidden =  false;
      this.isShowInsuranceVerification=false;
      this.isPersonalInfoFormHidden = true;
      this.isIncidentDetailsFormHidden = true;
      this.handlingissuesFormHidden = true;
      this.isProductDetailsFormHidden =  true;
      this.isShowInsuranceVerification = false;
        }else {
          this.common.openSnackBar('Invalid access',2,'Unauthorized')
          this.router.navigate(['incident-list']);
        }
    }else{
      this.common.openSnackBar('Invalid access',2,'Unauthorized')
      this.router.navigate(['incident-list']);
    }
    
}
public assigneeGenericData:any = [];
public assignGenericFilterData:any = [];
async getAssigneesGenericList(){
  let response:any = await this.requestapi.getData(this.utils.API.GET_ASSIGNEES_GENERIC_LIST+'?userName='+this.username);
   if(response){
     this.assigneeGenericData = response.payLoad;
    
     for(let x of this.assigneeGenericData){
       let isAlreadySelect =  this.selectedUsers.filter((item)=>{
        return item.emailAddress==x.emailAddress;
       })
       x.selected=(isAlreadySelect.length>0)?true:false;
       x.isDeleteAccess=(isAlreadySelect.length>0)?isAlreadySelect[0].isDeleteAccess:true;
     }
      this.assignGenericFilterData = this.assigneeGenericData;
   }
}
addAssigneeMail(){
  let email=this.incidentForm.value.assigneeSearchValue
  let isexist=this.selectedUsers.filter((item:any)=>{
   return item.emailAddress==email
  })
  if(isexist.length>0){
   this.common.openSnackBar('Email already exist',2,'Required');
  }else if(this.common.isValidEmail(this.incidentForm.value.assigneeSearchValue)){
    let data={
   "id":0,
   "roleName":"",
   "firstName":"",
   "lastName":"",
   "emailAddress":this.incidentForm.value.assigneeSearchValue,
   "roleCode":"",
   "createdOn":"",
   "modifiedOn":"",
   "createdBy":null,
   "modifiedBy":null,
   "isActive":1,
   "isDeleteAccess":true
 }
 this.selectedUsers.push(data);
 this.incidentForm.patchValue({assigneeSearchValue:''})
  }else{
    this.common.openSnackBar('Please enter valid assignee email',2,'Invalid');
  }
}
public formFieldDescriptionData:any;
async getFormFieldDescription(){
  let response:any = await this.requestapi.getData(this.utils.API.GET_INCIDENT_FORM_FIELD_DESCRIPTION+'?userName='+this.username);
   if(response){
     this.formFieldDescriptionData = response.payLoad; console.log(this.formFieldDescriptionData,"this.formFieldDescriptionData");
   }
}
async lockIncident(incidentId:any){
  let param ={
    "incidentId":incidentId,
    "lockedUserId":this.username,
    "pageName":"update",
    "userName":this.username
}

   let response:any=await this.requestapi.postData(this.utils.API.INCIDENT_LOCK,param);

  if(response){
   if(response.payLoad.lockedStatus==true && this.username!=response.payLoad.lockedUserId){
     this.common.openSnackBar("This Incident was editing by "+response.payLoad.lockedUser,2,'');
     this.router.navigate(['incident-list']);
   }else{
     this.router.navigate(['incident-create']);
   }
  }
}

}
