import {
  Component,
  OnInit,
  Input,
  HostListener,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { IncidentService } from "../incident.service";
import { Router } from "@angular/router";
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
} from "@angular/material/dialog";
import { WitnessFormComponent } from "../witness-form/witness-form.component";
import * as _ from "lodash";
import { IncidentFormValidationService } from "../incident-form-validation.service";

import * as moment from "moment";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-incident-history-view',
  templateUrl: './incident-history-view.component.html',
  styleUrls: ['./incident-history-view.component.scss']
})
export class IncidentHistoryViewComponent implements OnInit {
  @HostListener("window:beforeunload", ["$event"])
  onBeforeUnload(event: any) {
    event.preventDefault();
    event.returnValue = "Your data will be lost!";
    // if(this.incidentData.isAdd || this.incidentForm.value.incidentStatus=='Draft'){
    // this.onSaveDraft(2);
    // }
    if (!this.incidentData.isAdd) {
      //this.releaseIncidentLock();
    }

    localStorage.setItem("currentIncident", JSON.stringify(this.incidentData));
    //alert("are you sure want to leave the page");
    return false;
  }
  public tableHistoryColumns: any = [];
  public incidentEditData: any;
  showMoreCommentCount = 1;
  isShowWitnessAvailable: boolean = true;
  incidentSubscription: any;
  productIdData: any;
  productDescriptionData: any;
  incidentSelectedTypeData: any;
  incidentData: any = { isAdd: true, incidentRowData: {} };
  isPersonalInfoFormHidden: boolean = false;
  isPersonalInfoViewHidden: boolean = true;
  isIncidentDetailsFormHidden: boolean = true;
  isIncidentDetailsViewHidden: boolean = true;
  isProductDetailsFormHidden: boolean = true;
  isProductDetailsViewHidden: boolean = true;
  public fileInPutData: any;
  public proofOfPurchaseFileInPutData: any = {};

  incidentFormAccess: any = {
    customer: {},
    employee: {},
    contractor: {},
    product: {},
  };
  public isShowInsuranceVerification = false;
  isAssginHandlingShow: boolean = false;
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
  };
  loginEmployeeCountry: any;
  loginEmployeeRegion: any
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
    },
    isHistory: true,
    incidentEditData: {}
  };
  personalInfoView: any = {
    incidentForm: {}, formFieldAccess: {}, showData: {
      injuredPersonFullName: '',
      ageType: '',
      ageValue: '',
      genderType:'',
      calculatedAge: '',
      appropriateAge: '',
      injuredPersonContactNumber: '',
      injuredPersonEmail: '',
      parantsContactNo: '',
      injuredPersonAddress: '',
      store: '',
      significantOthers: '',
    }, redactRuleData: {}
  };
  productDetailsView: any = { incidentForm: {}, formFieldAccess: {}, showData: {}, redactRuleData: {} };
  legalInfoFormData: any = {
    incidentForm: {},
    formFieldAccess: {},
    toolTipData: {},
  };
  insuranceVerificationData: any = {
    incidentForm: {},
    formFieldAccess: {},
    toolTipData: {},
  };
  insuranceVerificationViewData: any = {
    incidentForm: {},
    formFieldAccess: {},
    toolTipData: {},
  }
  focusStyle: any = { border: "1px solid red" };
  public incidentViewData: any = {
    viewEvidenceData: [],
    incidentForm: {},
    formFieldAccess: {},
    showData: {
      eventActualDate: '',
      IsAprroximate: '',
      eventReportedDate: '',
      storeComments: '',
      injurySustained: '',
      circumstances: '',
      witnessAvailable: '',
      witnessList: '',
      evidenceAvailable: '',
      evidenceTakenBy: '',
      evidences: '',
      otherComments: ''
    }, redactRuleData: {}
  };
  selectedUsers: any = new Array<any>();

  filteredUsers: any;
  lastFilter: string = "";

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
    incidentForm: {},
    formFieldAccess: {},
    showData: { csdNumber: '', handlingTeams: [], priorityInfo: {}, formType: '' }
  };
  public showBasicInfoView: boolean = false;
  public loginEmployeeRoleCode: any;
  public historyTableDisplayColumns: any = [];
  isShowTable = false;
  retectedRuleData: any;
  public historyTableData: any = { columns: [], showColumn: [], data: [] };
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
  ) { }
  loginEmployeeId: any;
  isStoreDisable = false;
  tableHistoryData: any = [];
  public mainContentShow: boolean = false;
  public username: any = '';
  loginMainRoleCode: any;
  otherinfoData: any = { openWithBuyerVendor: '', incidentInjury: '', incidentCause: '', formFieldAccess: this.formFieldAccess, incidentForm: {}, isclosed: false };
  public isOtherInfoBoxShow: boolean = false;
  public isOtherInfoFormShow: boolean = false;
  public isOtherInfoViewShow: boolean = false;
  ngOnInit(): void {
    if (this.incidentService.isIncidentcreateAccess() || this.incidentService.isIncidentWriteAccess() || this.incidentService.isIncidentViewAccess()) {

    } else {
      this.common.openSnackBar('Invalid access', 2, 'Unauthorized')
      this.router.navigate(['incident-list']);
    }
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.username = localStorage.getItem('username');
    this.loginEmployeeId = userDetails.employeeId;
    this.loginEmployeeCountry = userDetails.country;
    this.loginEmployeeRegion = userDetails.region;
    this.loginEmployeeRoleCode = userDetails.incidentRole;
    this.loginMainRoleCode = userDetails.roleCode;
    this.tableHistoryColumns = this.utils.TABLE_HEADERS.INCIDENT_HISTORY_TABLE;
    this.historyTableDisplayColumns = this.tableHistoryColumns.map((col: any) => col.indexName)
    this.getRetectedRoleMapInfo();
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
      genderType: [""],
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
      isApproximateDate: [false],
      reportedDate: ["", Validators.compose([])],
      reportedTime: [
        "",
        Validators.compose([this.validation.reportedTimeValidate]),
      ],
      eventReportedDate: [null],
      storeComments: ["", Validators.compose([Validators.required])],
      injurySustained: ["", Validators.compose([Validators.required])],
      injuryCircumstances: ["", Validators.compose([Validators.required])],
      witnessAvailable: ["", Validators.compose([Validators.required])],
      productIDView: [""],
      productDescriptionView: [""],
      productREcommentedAgeView: [""],
      evidenceAvailable: ["", Validators.compose([Validators.required])],
      evidenceTakenBy: [""],
      evidences: [[]],
      otherComments: [""],
      priorityCode: [""],
      csdNumber: [""],
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
      productAge: [""],
      proofOfPurchaseFilePath: [""],
      problemReportedBefore: [""],
      faultCode: [""],
      productCircumstances: [""],
      witnessList: this.fb.array([]),
      createdByRole: [""],
      incidentCountry: [""],
      incidentRegion: [""],
      createdBy: [this.loginEmployeeId],
      employeeId: [this.loginEmployeeId],
      incidentType: [""],
      incidentId: [""],
      storeName: [""],
      resolveActions: [[]],
      goodWillGuster: [""],
      actionTakenToResolve: [""],
      assigneeSearchValue: [""],
      handlingTeams: [[]],
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
      openWithBuyerVendor: [''],
      incidentInjury: [''],
      incidentCause: ['']
    });

    this.witnessDataList = this.incidentForm.get("witnessList") as FormArray;
    this.toolTipData = this.utils.tooltipMessage.toolTipData;
    this.formFieldAccess = this.utils.formAccess.allFormAccess;
    let currentIncident = localStorage.getItem("currentIncident");
    if (
      currentIncident != "" &&
      currentIncident != null &&
      currentIncident != undefined &&
      currentIncident != "undefined"
    ) {
      this.incidentSelectedTypeData =
        JSON.parse(currentIncident).incidentSelectedTypeData;
      this.incidentData = JSON.parse(currentIncident);
      localStorage.removeItem("currentIncident");
      this.incidentService.historyIncidentsubject$.next(this.incidentData);
    }
    this.incidentSubscription = this.incidentService.historyIncidentsubject$.subscribe(
      (val: any) => {
        this.incidentData = val;
        let revision = this.incidentData.incidentRowData.revision;
        let id = this.incidentData.incidentRowData.id;
        this.incidentSelectedTypeData =
          this.incidentData.incidentSelectedTypeData;
        if (this.incidentData.isAdd == false) {
          this.ngxService.start();
          //this.setFormValue(this.incidentData.incidentRowData);
          this.getFieldAccessData();
          let idIncident = (this.incidentData.incidentStatus == 'Draft') ? this.incidentData.id : this.incidentData.idIncident;
          // this.getIncidentDetailsByIncidentID(this.incidentData.id);
          this.getHistoryDataByIncidentID(id, revision);
        } else {
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
      },
      (err) => console.error("Sub1 " + err),
      () => console.log("Sub1 Complete")
    );

    if (this.incidentSelectedTypeData.name == "Customer") {
      this.incidentFormAccess.customer =
        this.utils.formAccess.customerFormAccess;

      for (let x in this.formFieldAccess) {
        const hasKey = x in this.incidentFormAccess.customer;
        if (hasKey) {
          this.formFieldAccess[x] = this.incidentFormAccess.customer[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Employee") {
      this.incidentFormAccess.employee =
        this.utils.formAccess.employeeFormAccess;

      for (let x in this.formFieldAccess) {
        const hasKey = x in this.incidentFormAccess.employee;
        if (hasKey) {
          this.formFieldAccess[x] = this.incidentFormAccess.employee[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Contractor") {

      this.incidentFormAccess.contractor =
        this.utils.formAccess.contractorFormAccess;

      for (let x in this.formFieldAccess) {
        const hasKey = x in this.incidentFormAccess.contractor;
        if (hasKey) {
          this.formFieldAccess[x] = this.incidentFormAccess.contractor[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Product") {
      this.incidentFormAccess.product = this.utils.formAccess.productFormAccess;
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
    this.getFieldAccessData();
    this.getToolTipData();

    let evidenceAvailable = <FormControl>(
      this.incidentForm.get("evidenceAvailable")
    );

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
    witnessUnwillingToInvolve: boolean
  ): FormGroup {
    return this.fb.group({
      id: [id],
      witnessName: [witnessName, Validators.compose([Validators.required])],
      witnessContactNumber: [
        witnessContactNumber,
        Validators.compose([Validators.required]),
      ],
      witnessContactEmail: [
        witnessContactEmail,
        Validators.compose([Validators.required]),
      ],
      witnessAddress: [
        witnessAddress,
        Validators.compose([Validators.required]),
      ],
      witnessStatement: [
        witnessStatement,
        Validators.compose([Validators.required]),
      ],
      witnessUnwillingToInvolve: [
        witnessUnwillingToInvolve,
        Validators.compose([Validators.required]),
      ],
    });
  }
  addWitness(
    id: number,
    witnessName: string,
    witnessContactNumber: string,
    witnessContactEmail: string,
    witnessAddress: string,
    witnessStatement: string,
    witnessUnwillingToInvolve: boolean
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
          witnessUnwillingToInvolve
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
    this.incidentSubscription.unsubscribe();
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

  async getToolTipData() {
    let response: any = await this.requestapi.getData(
      this.utils.API.INCIDENT_TOOLTIP_URL + '?userName=' + this.username
    );
    if (response) {
      let tooltipData = response.payLoad;
      this.toolTipData = JSON.parse(tooltipData[0].tooltipText);
    }
  }
  async getFieldAccessData() {

    let requestParam = { roleName: this.loginEmployeeRoleCode, country: this.loginEmployeeCountry };
    let response: any = await this.requestapi.getData(
      this.utils.API.INCIDENT_FIELD_ACCESS_URL + "?roleName=" + this.loginEmployeeRoleCode + "&country=" + this.loginEmployeeCountry + '&userName=' + this.username
    );
    if (response) {
      let data = response.payLoad;
      let customerAccess = {};
      let employeeAccess = {};
      let contractorAccess = {};
      let productAccess = {};
      // let customerAccess = JSON.parse(data.customerFormFields);
      // let employeeAccess = JSON.parse(data.employeeFormFields);
      // let contractorAccess = JSON.parse(data.contractorFormFields);
      // let productAccess = JSON.parse(data.productFormFields);
      if (data.length > 0) {
        for (let x of data) {
          if (x.formName == 'customer') {
            customerAccess = JSON.parse(x.formFields);
          } else if (x.formName == 'contractor') {
            contractorAccess = JSON.parse(x.formFields);
          } else if (x.formName == 'employee') {
            employeeAccess = JSON.parse(x.formFields);
          } else if (x.formName == 'product') {
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


      for (let x in this.formFieldAccess) {
        //const hasKey = x in this.incidentFormAccess.customer;
        const hasKey = x in customerAccess;
        if (hasKey) {
          //this.formFieldAccess[x] = this.incidentFormAccess.customer[x];
          this.formFieldAccess[x] = customerAccess[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Employee") {
      this.incidentFormAccess.employee =
        this.utils.formAccess.employeeFormAccess;
      for (let x in this.formFieldAccess) {
        //const hasKey = x in this.incidentFormAccess.employee;
        const hasKey = x in employeeAccess;
        if (hasKey) {
          // this.formFieldAccess[x] = this.incidentFormAccess.employee[x];
          this.formFieldAccess[x] = employeeAccess[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Contractor") {

      this.incidentFormAccess.contractor =
        this.utils.formAccess.contractorFormAccess;

      for (let x in this.formFieldAccess) {
        //const hasKey = x in this.incidentFormAccess.contractor;
        const hasKey = x in contractorAccess;
        if (hasKey) {
          //this.formFieldAccess[x] = this.incidentFormAccess.contractor[x];
          this.formFieldAccess[x] = contractorAccess[x];
        }
      }
    } else if (this.incidentSelectedTypeData.name == "Product") {
      this.incidentFormAccess.product = this.utils.formAccess.productFormAccess;
      for (let x in this.formFieldAccess) {
        //const hasKey = x in this.incidentFormAccess.product;
        const hasKey = x in productAccess;
        if (hasKey) {
          // this.formFieldAccess[x] = this.incidentFormAccess.product[x];
          this.formFieldAccess[x] = productAccess[x];
        }
      }
    }
    this.isAssginHandlingShow = this.incidentService.isShowHandlingTeam(this.formFieldAccess);

    let insuranceShow = this.incidentService.isLegalInfoViewAccess(this.formFieldAccess, this.incidentForm);
    this.isShowInsuranceVerification = insuranceShow;
    this.isOtherInfoBoxShow = this.incidentService.isOtherinfoviewshow(this.formFieldAccess)

  }
  gotToList() {
    this.router.navigate(["incident-list"]);
  }


  editPersonalInfo(data: any) {
    this.isPersonalInfoFormHidden = false;
    this.isPersonalInfoViewHidden = true;
  }
  editIncidentDetails(data: any) {
    this.isIncidentDetailsFormHidden = false;
    this.isIncidentDetailsViewHidden = true;
    this.incidentViewData.incidentForm = this.incidentForm;
    this.incidentViewData.formFieldAccess = this.formFieldAccess;
    this.incidentViewData.viewEvidenceData = this.viewEvidenceData;
  }
  editProductDetails(data: any) {
    this.isProductDetailsFormHidden = false;
    this.isProductDetailsViewHidden = true;
  }


  get formIncidentControls(): any {
    return this.incidentForm["controls"];
  }

  focusinmethod() {
    let b = document.body;
    b.style.overflow = "hidden";
  }
  focusoutmethod() {
    let b = document.body;
    b.style.overflow = "auto";
  }

  async getHistoryDataByIncidentID(id: any, revision: any) {

    let response: any = await this.requestapi.getData(this.utils.API.GET_INCIDENT_HISTORY_URL + '?id=' + id + '&revisionId=' + revision + '&userName=' + this.username);
    if (response) {
      this.incidentEditData = response.payLoad;
      this.isIncidentRedected();
      this.setFormValue(this.incidentEditData);
      this.ngxService.stop();
    }
  }
  async getRetectedRoleMapInfo() {

    let response: any = await this.requestapi.getData(this.utils.API.GET_ROLE_MAP_INFO_URL + '?roleName=' + this.loginEmployeeRoleCode + '&country=' + this.loginEmployeeCountry + '&userName=' + this.username);
    if (response) {
      this.retectedRuleData = response.payLoad;
    }
  }
  setFormValue(data: any) {
    this.incidentForm.patchValue({
      id: data.id,
      injuredPersonFullName: data.injuredPersonFullName,
      ageType: data.ageType,
      ageValue: data.ageValue.toString(),
      genderType: data.genderType,
      calculatedAge: data.calculatedAge,
      appropriateAge: data.appropriateAge,
      injuredPersonContactNumber: data.injuredPersonContactNumber.toString(),
      injuredPersonEmail: data.injuredPersonEmail,
      parantsContactNo: (data.injuredParentsContactNo !== null) ? data.injuredParentsContactNo.toString() : '',
      injuredPersonAddress: data.injuredPersonAddress,
      store: data.store,
      significantOthers: data.significantOthers,
      eventDate:
        data.eventActualDate != "" && data.eventActualDate != null
          ? this.datepipe.transform(data.eventActualDate, "yyyy-MM-dd")
          : "",
      eventTime:
        data.eventActualDate != "" && data.eventActualDate != null
          ? this.datepipe.transform(data.eventActualDate, "HH:mm")
          : "",
      eventActualDate: data.eventActualDate,
      isApproximateDate: data.approximateDate,
      reportedDate:
        data.eventReportedDate != "" && data.eventReportedDate != null
          ? this.datepipe.transform(data.eventReportedDate, "yyyy-MM-dd")
          : "",
      reportedTime:
        data.eventReportedDate != "" && data.eventReportedDate != null
          ? this.datepipe.transform(data.eventReportedDate, "HH:mm")
          : "",
      eventReportedDate: data.eventReportedDate,
      storeComments: data.storeComments,
      injurySustained: data.injurySustained,
      injuryCircumstances: data.injuryCircumstances,
      witnessAvailable: data.witnessAvailable,
      productIDView:
        data.articleId != null
          ? data.articleId + "-" + data.productDescription
          : "",
      productDescriptionView:
        data.articleId != null ? data.productDescription : "",
      productREcommentedAgeView:
        data.articleId != null ? data.childRecommendedAge : "",
      evidenceAvailable: data.evidenceAvailable,
      evidenceTakenBy: data.evidenceTakenBy,
      evidences: data.evidences,
      otherComments: data.otherComments,
      priorityCode: data.priorityCode,
      csdNumber: data.csdNumber,
      productComplaint: data.complainant != null ? data.complainant : "",
      productId: data.articleId != null ? data.articleId : "",
      productDescription: data.articleId != null ? data.productDescription : "",
      recommendedAge: data.articleId != null ? data.childRecommendedAge : "",
      childRecommendedAge:
        data.articleId != null ? data.childRecommendedAge : "",
      batchNo: data.batchNo,
      productReturnToStore: data.returnToStoreDate,
      productReturnToHeadOffice: data.returnToHeadOfficeDate,
      productAge: data.productAge,
      proofOfPurchaseFilePath: data.proofOfPurchaseFilePath,
      problemReportedBefore: data.problemReportedBefore,
      faultCode: data.faultCode,
      productCircumstances: data.injuryCircumstances,
      witnessList: data.witnessList,
      createdByRole: "",
      incidentCountry: data.incidentCountry,
      incidentRegion: data.incidentRegion,
      createdBy: this.loginEmployeeId,
      employeeId: this.loginEmployeeId,
      incidentType: data.incidentType,
      incidentId: data.incidentId,
      resolveActions:
        data.resolveActions != "" && data.resolveActions != null
          ? data.resolveActions
          : [],
      goodWillGuster: "",
      actionTakenToResolve: "",
      assigneeSearchValue: "",
      handlingTeams: data.handlingTeams,
      storeName: data.storeName,
      productAgeType: (data.productAgeType != undefined && data.productAgeType != null) ? data.productAgeType : ''
    });
    let id = 0;
    this.isShowWitnessAvailable = data.witnessList.length > 0 ? false : true;
    for (let x of data.witnessList) {
      id = id + 1;
      this.addWitness(
        id,
        x.witnessName,
        x.witnessContactNumber,
        x.witnessContactEmail,
        x.witnessAddress,
        x.witnessStatement,
        x.witnessUnwillingToInvolve
      );
    }
    for (let ht of data.handlingTeams) {
      let htdata = {
        country: "UK",
        createdDate: "2022-03-08T18:30:00.000+00:00",
        dateOfJoining: null,
        emailId: ht.emailId,
        employeeId: ht.assignedEmployeeId,
        employeeName: ht.employeeName,
        employeeRole: ht.employeeRole,
        managerId: "1186",
        personalInfo: null,
        phoneNo: null,
        region: "Carrickmines Dublin",
        roleCode: "SM",
        selected: true,
        status: "",
      };
      this.selectedUsers.push(htdata);
    }
    this.access = 'View';
    if (this.access == "View" || this.access == "All") {

      this.personalInfoView.incidentForm = this.incidentForm;
      this.personalInfoView.formFieldAccess = this.formFieldAccess;
      this.personalInfoView.redactRuleData = this.retectedRuleData;
      this.personalInfoView.showData = {
        isRedacted: this.isRedacted,
        injuredPersonFullName: this.incidentEditData.injuredPersonFullName,
        ageType: this.incidentEditData.ageType,
        ageValue: this.incidentEditData.ageValue,
        genderType:this.incidentEditData.genderType,
        calculatedAge: this.incidentEditData.calculatedAge,
        appropriateAge: this.incidentEditData.appropriateAge,
        injuredPersonContactNumber: this.incidentEditData.injuredPersonContactNumber,
        injuredPersonEmail: this.incidentEditData.injuredPersonEmail,
        parantsContactNo: this.incidentEditData.parantsContactNo,
        injuredPersonAddress: this.incidentEditData.injuredPersonAddress,
        store: this.incidentEditData.storeName,
        significantOthers: this.incidentEditData.significantOthers
        , createdOn: this.incidentEditData.createdOn
      }
      this.incidentViewData.incidentForm = this.incidentForm;
      this.incidentViewData.formFieldAccess = this.formFieldAccess;
      this.incidentViewData.redactRuleData = this.retectedRuleData;
      this.incidentViewData.showData = {
        isRedacted: this.isRedacted,
        eventActualDate: this.incidentEditData.eventActualDate,
        IsAprroximate: this.incidentEditData.approximateDate,
        eventReportedDate: this.incidentEditData.eventReportedDate,
        storeComments: this.incidentEditData.storeComments,
        injurySustained: this.incidentEditData.injurySustained,
        circumstances: this.incidentEditData.injuryCircumstances,
        witnessAvailable: this.incidentEditData.witnessAvailable,
        witnessList: this.incidentEditData.witnessList,
        evidenceAvailable: this.incidentEditData.evidenceAvailable,
        evidenceTakenBy: this.incidentEditData.evidenceTakenBy,
        evidences: this.incidentEditData.evidencesList,
        otherComments: this.incidentEditData.otherComments,
        createdOn: this.incidentEditData.createdOn,
        incidentTypeName: this.incidentSelectedTypeData.name
      }
      this.productDetailsView.incidentForm = this.incidentForm;
      this.productDetailsView.formFieldAccess = this.formFieldAccess;
      this.productDetailsView.redactRuleData = this.retectedRuleData;
      this.productDetailsView.showData = {
        isRedacted: this.isRedacted, productComplaint: this.incidentEditData.complainant,
        productId: this.incidentEditData.articleId,
        productDescription: this.incidentEditData.productDescription,
        recommendedAge: this.incidentEditData.childRecommendedAge,
        batchNo: this.incidentEditData.batchNo,
        productReturnToStore: this.incidentEditData.returnToStoreDate,
        productReturnToHeadOffice: this.incidentEditData.returnToHeadOfficeDate,
        productAge: this.incidentEditData.productAge,
        evidence: this.incidentEditData.evidence,
        problemReportedBefore: this.incidentEditData.problemReportedBefore,
        priority: (this.incidentEditData.priorityInfo != null) ? this.incidentEditData.priorityInfo.colorCode : '',
        circumstances: this.incidentEditData.injuryCircumstances,
        faultCode: this.incidentEditData.faultCode,
        priorityCode: this.incidentEditData.priorityCode,
        priorityInfo: this.incidentEditData.priorityInfo,
        faultCodesInfo: this.incidentEditData.faultCodesInfo,
        createdOn: this.incidentEditData.createdOn,
        evidences: (this.incidentEditData.evidencesList != null) ? this.incidentEditData.evidencesList : []
        , productAgeType: (this.incidentEditData.productAgeType != undefined && this.incidentEditData.productAgeType != null) ? this.incidentEditData.productAgeType : ''
      };
      this.issuesHandlingViewData.incidentForm = this.incidentForm;
      this.issuesHandlingViewData.formFieldAccess = this.formFieldAccess;
      this.issuesHandlingViewData.showData = {
        formType: this.incidentSelectedTypeData.name,
        isRedacted: this.isRedacted, csdNumber: this.incidentEditData.csdNumber,
        handlingTeams: this.incidentEditData.handlingTeams, priorityInfo: (this.incidentEditData.priorityInfo != null) ? this.incidentEditData.priorityInfo : null
      }
      this.issuesHandlingViewData.redactRuleData = this.retectedRuleData;
      this.legalInfoFormData.incidentForm = this.incidentForm;
      this.legalInfoFormData.formFieldAccess = this.formFieldAccess;
      this.legalInfoFormData.toolTipData = this.toolTipData;
      this.insuranceVerificationData.formFieldAccess = this.formFieldAccess;
      this.insuranceVerificationData.showData = {
        isRedacted: this.isRedacted, severityInfo: this.incidentEditData.severityInfo,
        preventabilityInfo: this.incidentEditData.preventabilityInfo,
        incidentCodesInfo: this.incidentEditData.incidentCodesInfo,
        legalStatusInfo: this.incidentEditData.legalStatusInfo,
        photoStatusInfo: this.incidentEditData.photoStatusInfo,
        cctvStatusInfo: this.incidentEditData.cctvStatusInfo, deleteDate: this.incidentEditData.deletionDate,
        initials: this.incidentEditData.initials,
        severity: (this.incidentEditData.severityInfo != null && this.incidentEditData.severityInfo != '') ? this.incidentEditData.severityInfo.id : '',
        preventability: (this.incidentEditData.preventabilityInfo != null && this.incidentEditData.preventabilityInfo != '') ? this.incidentEditData.preventabilityInfo.id : '',
        claimDate: this.incidentEditData.claimDate,
        legalStatus: (this.incidentEditData.legalStatusInfo != null && this.incidentEditData.legalStatusInfo != '') ? this.incidentEditData.legalStatusInfo.id : '',
        claimReference: this.incidentEditData.claimReference,
        photoStatusCode: (this.incidentEditData.photoStatusInfo != null && this.incidentEditData.photoStatusInfo != '') ? this.incidentEditData.photoStatusInfo.id : '',
        cctvStatusCode: (this.incidentEditData.cctvStatusInfo != null && this.incidentEditData.cctvStatusInfo != '') ? this.incidentEditData.cctvStatusInfo.id : '',
      };
      this.basicInfoViewData.incidentForm = this.incidentForm;
      this.basicInfoViewData.formFieldAccess = this.formFieldAccess;
      this.basicInfoViewData.incidentEditData = this.incidentEditData;
      let showBasicData = {
        isRedacted: this.isRedacted,
        createdBy: data.createdBy,
        status: data.incidentStatus,
        date: data.createdOn,
        injured: data.caseType,
        store: data.storeName,
        versionDate: this.incidentEditData.convertedCreatedDate,
        versionSavedUser: this.incidentEditData.createdBy,
        incidentEditData: this.incidentEditData,
        regionName: this.incidentEditData.incidentRegionName
      }
      this.basicInfoViewData.showData = showBasicData;
      this.basicInfoViewData.access = this.access;
      this.basicInfoViewData.redactRuleData = this.retectedRuleData;
      this.insuranceVerificationViewData.incidentForm = this.incidentForm;
      this.insuranceVerificationViewData.formFieldAccess = this.formFieldAccess;
      this.insuranceVerificationViewData.toolTipData = this.toolTipData;

      this.insuranceVerificationViewData.showData = {
        isRedacted: this.isRedacted, severityInfo: this.incidentEditData.severityInfo,
        preventabilityInfo: this.incidentEditData.preventabilityInfo,
        legalStatusInfo: this.incidentEditData.legalStatusInfo,
        photoStatusInfo: this.incidentEditData.photoStatusInfo,
        cctvStatusInfo: this.incidentEditData.cctvStatusInfo, deleteDate: this.incidentEditData.deletionDate,
        initials: this.incidentEditData.initials,
        severity: (this.incidentEditData.severityInfo != null && this.incidentEditData.severityInfo != '') ? this.incidentEditData.severityInfo.id : '',
        preventability: (this.incidentEditData.preventabilityInfo != null && this.incidentEditData.preventabilityInfo != '') ? this.incidentEditData.preventabilityInfo.id : '',
        claimDate: this.incidentEditData.claimDate,
        legalStatus: (this.incidentEditData.legalStatusInfo != null && this.incidentEditData.legalStatusInfo != '') ? this.incidentEditData.legalStatusInfo.id : '',
        claimReference: this.incidentEditData.claimReference,
        photoStatusCode: (this.incidentEditData.photoStatusInfo != null && this.incidentEditData.photoStatusInfo != '') ? this.incidentEditData.photoStatusInfo.id : '',
        cctvStatusCode: (this.incidentEditData.cctvStatusInfo != null && this.incidentEditData.cctvStatusInfo != '') ? this.incidentEditData.cctvStatusInfo.id : '',
      };
      this.showBasicInfoView = true;
      this.isPersonalInfoViewHidden = false;

      this.isIncidentDetailsViewHidden = false;
      this.isIncidentDetailsFormHidden = false;
      this.isOtherInfoBoxShow = this.incidentService.isOtherinfoviewshow(this.formFieldAccess)

      this.otherinfoData.formFieldAccess = this.formFieldAccess;
      this.otherinfoData.openWithBuyerVendor = this.incidentEditData.openWithBuyerVendor;
      this.otherinfoData.incidentInjury = this.incidentEditData.incidentInjury;
      this.otherinfoData.incidentCause = this.incidentEditData.incidentCause;
      this.otherinfoData.incidentInjuryDropDownInfo = this.incidentEditData.incidentInjuryDropDownInfo;
      this.otherinfoData.incidentCauseDropDownInfo = this.incidentEditData.incidentCauseDropDownInfo;
      this.otherinfoData.isclosed = true;
      if (this.incidentSelectedTypeData.name == "Product") {
        this.isProductDetailsFormHidden = false;
        this.isProductDetailsViewHidden = false;
      }
      this.handlingissuesFormHidden = false;
      this.handlingissuesViewHidden = false;

      let insuranceShow = this.incidentService.isLegalInfoViewAccess(this.formFieldAccess, this.incidentForm);
      this.isShowInsuranceVerification = insuranceShow;

    } else {
      this.isPersonalInfoViewHidden = false;
      this.isPersonalInfoFormHidden = true;
      this.isAssginHandlingShow = this.incidentService.isShowHandlingTeam(this.formFieldAccess)
      this.isIncidentDetailsViewHidden = false;
      this.isIncidentDetailsFormHidden = true;
      if (this.incidentSelectedTypeData.name == "Product") {
        this.isProductDetailsFormHidden = true;
        this.isProductDetailsViewHidden = false;
      }
      this.handlingissuesFormHidden = true;
      this.handlingissuesViewHidden = false;
      let insuranceShow = this.incidentService.isLegalInfoViewAccess(this.formFieldAccess, this.incidentForm);
      this.isShowInsuranceVerification = insuranceShow;
    }

    this.historyTableData.colums = this.utils.TABLE_HEADERS.INCIDENT_HISTORY_TABLE.map(name => name.indexName);
    this.historyTableData.showColumn = this.utils.TABLE_HEADERS.INCIDENT_HISTORY_TABLE;

    this.historyTableData.data = this.incidentEditData.incidentVersionLists;
    //this.isShowTable = true;
    this.optionData = (this.incidentEditData.priorityInfo != null) ? this.incidentEditData.priorityInfo.colorCode : '';
    this.mainContentShow = true;

  }
  optionData: any;
  editHandlingIssues(data: any) { }
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
  async releaseIncidentLock() {
    let param = {
      "incidentId": (this.incidentEditData.incidentStatus == 'Draft') ? this.incidentEditData.id : this.incidentEditData.incidentId,
      "employeeId": this.loginEmployeeId, 'userName': this.username
    };
    let response: any = await this.requestapi.postData(this.utils.API.RELEASE_INCIDENT_LOCK, param);

  }
  redirectVersionHistory(rowData: any) {
  }
  onHistoryClick(content: any) {
    this.dialog.open(content, {
      width: "450px",
      // enterAnimationDuration: "100ms",
      // exitAnimationDuration: "1500ms",
    });
    this.isShowTable = true;
  }
  isRedacted: boolean = false;
  isIncidentRedected() {
    let redectedRule = this.retectedRuleData.redactRules;
    if (redectedRule == 'yes' && this.incidentData.isAdd == false) {
      let createdOn = this.incidentEditData.createdOn;
      this.isRedacted = this.common.compareDateTwoMonthCompleted(createdOn, this.retectedRuleData.redactedDays);
    }
  }
  setotherInfovalue(e: any) {
    this.incidentForm.patchValue({ openWithBuyerVendor: (e.openWithBuyerVendor == true) ? 'yes' : 'no', incidentInjury: e.incidentInjury, incidentCause: e.incidentCause })
  }
}

