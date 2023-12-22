import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from "rxjs";
import { CommonService } from '../shared/services/incident-services/common.service';
import { DatePipe } from "@angular/common";
@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  subject$ = new ReplaySubject(1);
  historyIncidentsubject$ = new ReplaySubject(1);
  public titleData: any[] = [{id:1,name:'Incident',url:'incident-list',isActive:true}]
  constructor(private common:CommonService,private datepipe:DatePipe) { }

validatePersonalInfo(incidentForm:any,incidentSelectedTypeData:any){
  let isValid = true;
  if(this.common.isEmpty(incidentForm.value.injuredPersonFullName)){
       this.common.openSnackBar('Please enter name',2,'Required');
       isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.ageType)){
       this.common.openSnackBar('Please select age type',2,'Required');
       isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.ageValue)){
    let msg=(incidentForm.value.ageType=='Year')?"Please enter No Of Year":"Please Enter No Of month";
       this.common.openSnackBar(msg,2,'Required');
       isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.ageValue)){
    let msg=(incidentForm.value.ageType=='Year')?"Please enter No Of Year":"Please Enter No Of month";
       this.common.openSnackBar(msg,2,'Required');
       isValid = false;
  }else if((incidentSelectedTypeData.name=='Employee' || incidentSelectedTypeData.name=='Contractor') && incidentForm.value.calculatedAge<18){
    let msg=(incidentForm.value.ageType=='Year')?"No of year must be above 18":"No of year must be above 18";
    this.common.openSnackBar(msg,2,'Required');
    isValid = false;
  }else if(incidentSelectedTypeData.name=='Product' && incidentForm.value.calculatedAge<18 && this.common.isEmpty(incidentForm.value.parantsContactNo)){
    this.common.openSnackBar('Please enter parants contect number',2,'Required');
    isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.injuredPersonContactNumber)){
    this.common.openSnackBar('Please enter Injured person conect number',2,'Required');
    isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.injuredPersonEmail)){
     this.common.openSnackBar('Please enter Injured person email',2,'Required');
    isValid = false;
  }else if(this.common.isValidEmail(incidentForm.value.injuredPersonEmail)===false){
     this.common.openSnackBar('Please enter Valid email',2,'Required');
   isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.injuredPersonAddress)){
     this.common.openSnackBar('Please enter Injured person address',2,'Required');
   isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.store)){
     this.common.openSnackBar('Please select store',2,'Required');
   isValid = false;
  }else if(incidentSelectedTypeData.name=='Customer' && this.common.isEmpty(incidentForm.value.significantOthers)){
     this.common.openSnackBar('Please enter significant name',2,'Required');
  isValid = false;
  }else{
      isValid = true;
  }
  return isValid;
}
validateIncidentDetails(incidentForm:any){
  let witnessErrorMessage = '';
  let witnessStatus = true;
  let isValid = true;
  if(incidentForm.value.witnessAvailable==true){
       let widnessData=incidentForm.value.witnessList;
       if(widnessData.length>0){
            for(let x of widnessData){
           if(this.common.isEmpty(x.witnessName)){
           witnessErrorMessage = 'Please enter witness name';
           witnessStatus = false;
             break;
           }else if(this.common.isEmpty(x.witnessContactNumber)){
           witnessErrorMessage = 'Please enter witness contact number';
           witnessStatus = false;
             break;
           }else if(this.common.isEmpty(x.witnessAddress)){
           witnessErrorMessage = 'Please enter witness address';
           witnessStatus = false;
             break;
           }else if(this.common.isEmpty(x.witnessStatement)){
           witnessErrorMessage = 'Please enter witness statement';
           witnessStatus = false;
             break;
           }
       }
       }else {
           witnessErrorMessage = 'Please Add atleast one witness';
           witnessStatus = false;
       }

  }
  if(this.common.isEmpty(incidentForm.value.eventDate)){
       this.common.openSnackBar('Please select incident date',2,'Required');
       isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.eventTime)){
       this.common.openSnackBar('Please enter incident time ',2,'Required');
       isValid = false;
  }else if(!this.common.isValidTimeFormat(incidentForm.value.eventTime)){
      this.common.openSnackBar('Please enter valid incident time ',2,'Required');
      isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.reportedDate)){
       this.common.openSnackBar('Please select reported date ',2,'Required');
       isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.reportedTime)){
       this.common.openSnackBar('Please enter reported time ',2,'Required');
       isValid = false;
  }else if(!this.common.isValidTimeFormat(incidentForm.value.reportedTime)){
      this.common.openSnackBar('Please enter valid reported time ',2,'Required');
      isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.witnessAvailable)){
       this.common.openSnackBar('Please select witness available or not ',2,'Required');
       isValid = false;
  }else if(incidentForm.value.witnessAvailable==true && witnessStatus==false){
       this.common.openSnackBar(witnessErrorMessage,2,'Required');
       isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.evidenceAvailable)){
       this.common.openSnackBar('Please select evidence available or not ',2,'Required');
       isValid = false;
  }else if(incidentForm.value.evidenceAvailable=='true' && this.common.isEmpty(incidentForm.value.evidenceTakenBy)){
    this.common.openSnackBar('Please enter evidence taken person name ',2,'Required');
    isValid = false;
  }
  else if(incidentForm.value.evidenceAvailable=='true' &&  incidentForm.value.evidences.length===0){
    this.common.openSnackBar('Please select atlease one evidence file',2,'Required');
    isValid = false;
  }
  else{
    isValid = true;
  }
  return isValid;
}

validateProductDetails(incidentForm:any){
  let isValid = true;
  if(this.common.isEmpty(incidentForm.value.productComplaint)){
       this.common.openSnackBar('Please enter complaint',2,'Required');
       isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.productId)){
       this.common.openSnackBar('Please enter product id ',2,'Required');
        isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.productDescription)){
       this.common.openSnackBar('Please enter product description ',2,'Required');
        isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.recommendedAge)){
       this.common.openSnackBar('Please enter recommended age ',2,'Required');
        isValid = false;
  }else if(this.common.isEmpty(incidentForm.value.batchNo)){
       this.common.openSnackBar('Please select batch number ',2,'Required');
        isValid = false;
  }else if( this.common.isEmpty(incidentForm.value.productReturnToStore)){
    this.common.openSnackBar('Please enter product Return To Store ',2,'Required');
     isValid = false;
  }else if( this.common.isEmpty(incidentForm.value.productReturnToHeadOffice)){
    this.common.openSnackBar('Please select product Return To Head Office',2,'Required');
     isValid = false;
  }else if( this.common.isEmpty(incidentForm.value.productAge)){
    this.common.openSnackBar('Please select product age',2,'Required');
     isValid = false;
  }else if( this.common.isEmpty(incidentForm.value.problemReportedBefore)){
    this.common.openSnackBar('Please select problem Reported Before',2,'Required');
     isValid = false;
  }else if( this.common.isEmpty(incidentForm.value.faultCode)){
    this.common.openSnackBar('Please select nature Of Product Fault',2,'Required');
     isValid = false;
  }else if( this.common.isEmpty(incidentForm.value.problemReportedBefore)){
    this.common.openSnackBar('Please select problem Reported Before',2,'Required');
     isValid = false;
  }else if( this.common.isEmpty(incidentForm.value.priorityCode)){
    this.common.openSnackBar('Please select priority',2,'Required');
     isValid = false;
  }else{
     isValid = true;
  }
  return isValid;
}
isLegalBoxShow(formAccess:any,roleCode:string,evidenceAvailable:any){
  let  isShow=false;
  for(let x in formAccess){

     if(x=='deletionDate' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='initials' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='incidentCode' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='severity' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='preventability' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='claimDate' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='claimReference' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if( (evidenceAvailable==true || evidenceAvailable =='true') && x=='photoStatus' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if((evidenceAvailable==true || evidenceAvailable =='true') && x=='cctvStatus' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }
  }
  return isShow;
}
isPersonalInfoEdit(formAccess:any){
     let  isShow=false;
  for(let x in formAccess){
     if(x=='injuredPersonFullName' && (formAccess[x].create || formAccess[x].write)){
       isShow=true;
       break;
     }else if(x=='complainant' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='ageDropdown' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='injuredPersonContactNo' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='emailAddress' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='address' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='significantOther' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }
  }
  return isShow;
}


isIncidentDetailsEdit(formAccess:any){
     let  isShow=false;

  for(let x in formAccess){
     if(x=='eventDateTime' && (formAccess[x].create || formAccess[x].write)){
       isShow=true;
       break;
     }else if(x=='eventDateApproximate' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='reportedDateTime' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='whereInStore' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='injurySustained' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='circumstances' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;

       break;
     }else if(x=='witnessAvailable' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='witnessName' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='witnesscontactNumber' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='witnessEmail' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='witnessAddress' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='witnessStatement' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='evidenceAvailable' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }
     // else if(x=='evidencetakenby' && (formAccess[x].create || formAccess[x].write)){
     //   isShow= true;
     //   break;
     // }
     else if(x=='evidenceTakenBy' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='otherComments' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }


  }
  return isShow;
}

isProductDetailsEdit(formAccess:any){
     let  isShow=false;

  for(let x in formAccess){
     if(x=='productId' && (formAccess[x].create || formAccess[x].write)){
       isShow=true;
       break;
     }else if(x=='productAge' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='natureOfProductFault' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='batchNo' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='recommendedAge' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='productReturnToStore' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='productReturnToHeadOffice' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='proofOfPurchase' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }else if(x=='problemReportedBefore' && (formAccess[x].create || formAccess[x].write)){
       isShow= true;
       break;
     }


  }

  return isShow;
}
isHandlingEdit(formAccess:any){
  console.log(formAccess,"formAccess");
  let isShow=false;
  for(let x in formAccess){
    if(x=='csdNumber' && (formAccess[x].create || formAccess[x].write)){
    isShow= true;
    break;
    }
    // else if(x=='priority' && (formAccess[x].create || formAccess[x].write)){
    // isShow= true;
    // break;
    // }
    else if(x=='handlers' && (formAccess[x].create || formAccess[x].write)){
    isShow= true;
    break;
    }
  }
  return isShow;

  }


  isLegalInfoViewAccess(formAccess:any){
  let  isShow=false;
  for(let x in formAccess){

     if(x=='deletionDate' && (formAccess[x].view)){
       isShow= true;
       break;
     }else if(x=='initials' && (formAccess[x].view)){
       isShow= true;

       break;
     }else if(x=='incidentCode' && (formAccess[x].view)){
       isShow= true;

       break;
     }else if(x=='severity' && (formAccess[x].view)){
       isShow= true;

       break;
     }else if(x=='preventability' && (formAccess[x].view)){
       isShow= true;

       break;
     }else if(x=='claimDate' && (formAccess[x].view)){
       isShow= true;

       break;
     }else if(x=='claimReference' && (formAccess[x].view)){
       isShow= true;

       break;
     }else if(x=='photoStatus' && (formAccess[x].view)){
       isShow= true;
       break;
     }else if(x=='cctvStatus' && (formAccess[x].view)){
       isShow= true;
       break;
     }
  }
  return isShow;
}
public validateWitnessBeforeAddUpdate(witnessData:any){

let isValid = true;
if(witnessData.witnessName=='' || witnessData.witnessName==null || witnessData.witnessName.toString().trim().length==0){
 isValid = false;
}
else if(witnessData.witnessContactNumber=='' || witnessData.witnessContactNumber==null || witnessData.witnessContactNumber.toString().trim().length==0){
isValid = false;
}
//else if(witnessData.witnessContactEmail=='' || witnessData.witnessContactEmail==null || witnessData.witnessContactEmail.toString().trim().length==0){
// isValid = false;
// }
// else if(witnessData.witnessAddress=='' || witnessData.witnessAddress==null || witnessData.witnessAddress.toString().trim().length==0){
// isValid = false;
// }
else if((witnessData.witnessStatement=='' || witnessData.witnessStatement==null || witnessData.witnessStatement.toString().trim().length==0) && witnessData.witnessFiles.length==0){
isValid = false;
}
return isValid;
}
public isShowHandlingTeam(formAccess:any){
  console.log(formAccess,"formAccess isShowHandling");
  let isShow=false;
  for(let x in formAccess){
    if(x=='csdNumber' && (formAccess[x].create || formAccess[x].write ||  formAccess[x].view)){
    isShow= true;
    break;
    }
    // else if(x=='priority' && (formAccess[x].create || formAccess[x].write)){
    // isShow= true;
    // break;
    // }
    else if(x=='handlers' && (formAccess[x].create || formAccess[x].write ||  formAccess[x].view)){
    isShow= true;
    break;
    }
  }
  return isShow;
}
getIncidentAccessData(){
  let finalAccess = {create:false,write:false,view:false};
  let allAccessData = JSON.parse(localStorage.getItem('accessApps')) ;
  let accessData = (allAccessData!=null)?allAccessData.filter(function(item:any){
              return item.app.appCode=='IT';
            }):[];
          // auditAccessData = allAccessData.filter(function(item:any){
          //     return item.app.appCode=='AT';
          //   })
          // authAccessData = allAccessData.filter(function(item:any){
          //     return item.app.id=='AA';
          //   })
  if(accessData.length>0){
    let appData = accessData[0].app;
    if(appData.access){
      let modules = appData.modules;
      if(modules.length>0){
        finalAccess = {create:modules[0].create,write:modules[0].update,view:modules[0].view};
      
      }
        }
    }
  
  return finalAccess;
}
isIncidentcreateAccess(){
  let accessData = this.getIncidentAccessData();
  return accessData.create;
}
isIncidentWriteAccess(){
  let accessData = this.getIncidentAccessData();
  return accessData.write;
}
isIncidentViewAccess(){
  let accessData = this.getIncidentAccessData();
  return accessData.view;
}
public isActionTakenBoxShow(formAccess:any){
   let isShow=false;
  for(let x in formAccess){
    if(x=='actionTakenToResolve' && (formAccess[x].create || formAccess[x].write)){
    isShow= true;
    break;
    }
    else if(x=='goodwillGesture' && (formAccess[x].create || formAccess[x].write)){
    isShow= true;
    break;
    }
    else if(x=='followUpCall' && (formAccess[x].create || formAccess[x].write )){
    isShow= true;
    break;
    }else if(x=='followUpCall' && (formAccess[x].create || formAccess[x].write )){
    isShow= true;
    break;
    }else if(x=='actionTakenComment' && (formAccess[x].create || formAccess[x].write )){
    isShow= true;
    break;
    }
    
  }
  return isShow;
 }
 deleteUnwantedParam(form:any){
    delete form['parantsContactNo'];
delete form['eventDate'];
delete form['eventTime'];
delete form['reportedDate'];
delete form['reportedTime'];
delete form['productIDView'];
delete form['productDescriptionView'];
delete form['productREcommentedAgeView'];
delete form['productComplaint'];
delete form['productId'];
delete form['recommendedAge'];
delete form['goodWillGuster'];
delete form['actionTakenToResolve'];
delete form['assigneeSearchValue'];
delete form['deleteDate'];
delete form['actoinTakenComment'];
delete form['followUpCall'];
return form;
  }
  getBasicInfoShowData(isRedacted:any,data:any,incidentEditData:any){
    let showData = {
        isRedacted:isRedacted,
        createdBy:data.createdBy,
        status:data.incidentStatus,
        date:data.createdOn,
        injured:data.caseType,
        store:data.storeName,
        versionDate:incidentEditData.incidentDetailsHistory.convertedCreatedDate,
        versionSavedUser:incidentEditData.incidentDetailsHistory.createdBy,
        incidentEditData:incidentEditData,
        regionName:incidentEditData.incidentRegionName
      }
      return showData;
  }
  getPersonalInfoViewData(isRedacted:any,incidentEditData:any){
    let showData = {isRedacted:isRedacted,
      injuredPersonFullName:incidentEditData.injuredPersonFullName,
      ageType:incidentEditData.ageType,
      ageValue:incidentEditData.ageValue,
      calculatedAge:incidentEditData.calculatedAge,
      appropriateAge:incidentEditData.appropriateAge,
      injuredPersonContactNumber:incidentEditData.injuredPersonContactNumber,
      injuredPersonEmail:incidentEditData.injuredPersonEmail,
      parantsContactNo:incidentEditData.parantsContactNo,
      injuredPersonAddress:incidentEditData.injuredPersonAddress,
      store:incidentEditData.storeName,
      significantOthers:incidentEditData.significantOthers,
      createdOn:incidentEditData.createdOn
    }
    return showData;
  }
  getIncidentViewData(isRedacted:any,incidentEditData:any,incidentSelectedTypeData:any){
    let showdata = {isRedacted:isRedacted,
        eventActualDate:incidentEditData.eventActualDate,
      IsAprroximate:incidentEditData.approximateDate,
      eventReportedDate:incidentEditData.eventReportedDate,
      storeComments:incidentEditData.storeComments,
      injurySustained:incidentEditData.injurySustained,
      circumstances:incidentEditData.injuryCircumstances,
      witnessAvailable:incidentEditData.witnessAvailable,
      witnessList:incidentEditData.witnessList,
      evidenceAvailable:incidentEditData.evidenceAvailable,
      evidenceTakenBy:incidentEditData.evidenceTakenBy,
      evidences:incidentEditData.evidences,
      otherComments:incidentEditData.otherComments,
      createdOn:incidentEditData.createdOn,incidentTypeName:incidentSelectedTypeData.name};
      return showdata;
  }
  getProductViewData(isRedacted:any,incidentEditData:any){
    let showData = {
      isRedacted:isRedacted,
      productComplaint:incidentEditData.complainant,
      productId:incidentEditData.articleId,
      productDescription:incidentEditData.productDescription,
      recommendedAge:incidentEditData.childRecommendedAge,
      batchNo:incidentEditData.batchNo,
      productReturnToStore:incidentEditData.productReturnToStore,
      productReturnToHeadOffice:incidentEditData.productReturnToHeadOffice,
      productAge:incidentEditData.productAge,
      evidence:incidentEditData.evidence,
      problemReportedBefore:incidentEditData.problemReportedBefore,
      priority:(incidentEditData.priorityInfo!=null)?incidentEditData.priorityInfo.colorCode:'',
      circumstances:incidentEditData.injuryCircumstances,
      faultCode:incidentEditData.faultCode,
      priorityCode:incidentEditData.priorityCode,
      priorityInfo:incidentEditData.priorityInfo,
      faultCodesInfo:incidentEditData.faultCodesInfo,
      createdOn:incidentEditData.createdOn,
      evidences:incidentEditData.evidences,
     productAgeType:(incidentEditData.productAgeType!=undefined && incidentEditData.productAgeType!=null)?incidentEditData.productAgeType:''
     };
     return showData;
  }

  getHandlingViewData(isRedacted:any,incidentSelectedTypeData:any,incidentEditData:any){
    let showData = {
      formType:incidentSelectedTypeData.name,
      isRedacted:isRedacted,
      csdNumber:incidentEditData.csdNumber,
      handlingTeams:incidentEditData.handlingTeams,
      priorityInfo:(incidentEditData.priorityInfo!=null)?incidentEditData.priorityInfo:null
    }
    return showData;
  }
  getInsuranceVerificationData(isRedacted:any,incidentEditData:any){
    let showData = {isRedacted:isRedacted,
      incidentPrimaryCode:incidentEditData.incidentPrimaryCode,
      incidentSecondaryCode:incidentEditData.incidentSecondaryCode,
      severityInfo:incidentEditData.severityInfo,
      preventabilityInfo:incidentEditData.preventabilityInfo,
      legalStatusInfo:incidentEditData.legalStatusInfo,
      photoStatusInfo:incidentEditData.photoStatusInfo,
      incidentCodesInfo:incidentEditData.incidentCodesInfo,
      cctvStatusInfo:incidentEditData.cctvStatusInfo,
      deleteDate:incidentEditData.deletionDate,
      initials:incidentEditData.initials,
      severity:(incidentEditData.severityInfo!=null && incidentEditData.severityInfo!='')?incidentEditData.severityInfo.id:'',
      preventability:(incidentEditData.preventabilityInfo!=null &&  incidentEditData.preventabilityInfo!='')?incidentEditData.preventabilityInfo.id:'',
      claimDate:incidentEditData.claimDate,
      legalStatus:(incidentEditData.legalStatusInfo!=null && incidentEditData.legalStatusInfo!='')? incidentEditData.legalStatusInfo.id:'',
      claimReference:incidentEditData.claimReference,
      photoStatusCode:(incidentEditData.photoStatusInfo!=null && incidentEditData.photoStatusInfo!='')?incidentEditData.photoStatusInfo.id:'',
      cctvStatusCode:(incidentEditData.cctvStatusInfo!=null && incidentEditData.cctvStatusInfo!='')?incidentEditData.cctvStatusInfo.id:''
      };
      return showData;
  }
getInsuranceverificationViewData(isRedacted:any,incidentEditData:any){
  let showData = {
        isRedacted:isRedacted,
        severityInfo:incidentEditData.severityInfo,
      preventabilityInfo:incidentEditData.preventabilityInfo,
      legalStatusInfo:incidentEditData.legalStatusInfo,
      photoStatusInfo:incidentEditData.photoStatusInfo,
      cctvStatusInfo:incidentEditData.cctvStatusInfo,deleteDate:incidentEditData.deletionDate,
      initials:incidentEditData.initials,
      incidentCodesInfo:(incidentEditData.incidentCodesInfo!=null)?incidentEditData.incidentCodesInfo:null,
      severity:(incidentEditData.severityInfo!=null && incidentEditData.severityInfo!='')?incidentEditData.severityInfo.id:'',
      preventability:(incidentEditData.preventabilityInfo!=null &&  incidentEditData.preventabilityInfo!='')?incidentEditData.preventabilityInfo.id:'',
      claimDate:incidentEditData.claimDate,
      legalStatus:(incidentEditData.legalStatusInfo!=null && incidentEditData.legalStatusInfo!='')? incidentEditData.legalStatusInfo.id:'',
      claimReference:incidentEditData.claimReference,
      photoStatusCode:(incidentEditData.photoStatusInfo!=null && incidentEditData.photoStatusInfo!='')?incidentEditData.photoStatusInfo.id:'',
      cctvStatusCode:(incidentEditData.cctvStatusInfo!=null && incidentEditData.cctvStatusInfo!='')?incidentEditData.cctvStatusInfo.id:''
    };
    return showData;
}
setFormJson(data:any,incidentEditData:any,productReturnToStore:any,
productReturnToHeadOffice:any,
username:any,eventDate:any,
reportedDate:any){
  let incidentFormData={
      id: data.id,
      incidentId:incidentEditData.incidentId,
      injuredPersonFullName: data.injuredPersonFullName,
      ageType: data.ageType,
      ageValue: data.ageValue.toString(),
      calculatedAge: data.calculatedAge,
      appropriateAge: data.appropriateAge,
      injuredPersonContactNumber: data.injuredPersonContactNumber.toString(),
      injuredPersonEmail: data.injuredPersonEmail,
      parantsContactNo: (data.injuredParentsContactNo!=null)?data.injuredParentsContactNo.toString():'',
      injuredPersonAddress: data.injuredPersonAddress,
      store: data.store,
      significantOthers: data.significantOthers,
      eventDate:
      data.eventActualDate != "" && data.eventActualDate != null
      ?  eventDate
      : "",
      eventTime:
      data.eventActualDate != "" && data.eventActualDate != null
      ? this.datepipe.transform(data.eventActualDate, "hh:mm")
      : "",
      eventActualDate: data.eventActualDate,
      approximateDate: data.approximateDate,
      reportedDate:
      data.eventReportedDate != "" && data.eventReportedDate != null
      ? reportedDate
      : "",
      reportedTime:
      data.eventReportedDate != "" && data.eventReportedDate != null
      ? this.datepipe.transform(data.eventReportedDate, "hh:mm")
      : "",
      eventReportedDate: data.eventReportedDate,
      storeComments: data.storeComments,
      injurySustained: data.injurySustained,
      injuryCircumstances: data.injuryCircumstances,
      witnessAvailable: (data.witnessSelected=='No')?"":data.witnessAvailable.toString(),
      productIDView:
      data.articleId != null && data.articleId != ''
      ? data.articleId + "-" + data.productDescription
      : "",
      productDescriptionView:
      data.articleId != null && data.articleId != '' ? data.productDescription : "",
      productREcommentedAgeView:
      data.articleId != null && data.articleId != '' ? data.childRecommendedAge : "",
      evidenceAvailable:(data.evidenceSelected=='No')?"": data.evidenceAvailable.toString(),
      evidenceTakenBy: data.evidenceTakenBy,
      evidences: data.evidences,
      otherComments: data.otherComments,
      priorityCode: data.priorityCode,
      csdNumber: data.csdNumber,
      complainant:data.complainant != null ? data.complainant : "",
      productComplaint: data.complainant != null ? data.complainant : "",
      productId: data.articleId != null ? data.articleId : "",
      articleId:data.articleId != null ? data.articleId : "",
      articleDescription:data.articleDescription != null ? data.articleDescription : "",
      productDescription: data.articleId != null ? data.productDescription : "",
      recommendedAge: data.articleId != null ? data.childRecommendedAge : "",
      childRecommendedAge:
      data.articleId != null ? data.childRecommendedAge : "",
      batchNo: data.batchNo,
      productReturnToStore:productReturnToStore,
      productReturnToHeadOffice: productReturnToHeadOffice,
      productAge: data.productAge,
      proofOfPurchaseFilePath: data.proofOfPurchaseFilePath,
      problemReportedBefore: data.problemReportedBefore,
      faultCode: data.faultCode,
      productCircumstances: data.injuryCircumstances,
      witnessList: data.witnessList,
      createdByRole: "",
      incidentCountry: data.incidentCountry,
      incidentRegion: data.incidentRegion,
      createdBy: username,
      // employeeId: this.loginEmployeeId,
      incidentType: data.incidentType,
      resolveActions:
      data.resolveActions != "" && data.resolveActions != null
      ? data.resolveActions
      : [],
      goodWillGuster: "",
      actionTakenToResolve: "",
      actoinTakenComment:"",
      assigneeSearchValue: "",
      handlingTeams: data.handlingTeams,
      storeName: data.storeName,
      incidentPrimaryCode:incidentEditData.incidentPrimaryCode,
      incidentSecondaryCode:incidentEditData.incidentSecondaryCode,
      initials: incidentEditData.initials,
      severity: incidentEditData.severity,
      preventability: incidentEditData.preventability,
      legalStatus: incidentEditData.legalStatus,
      claimReference: incidentEditData.claimReference,
      claimDate: incidentEditData.claimDate,
      cctvStatusCode: incidentEditData.cctvStatusCode,
      photoStatusCode: incidentEditData.photoStatusCode,
      deleteDate: incidentEditData.deleteDate,
       productAgeType:(incidentEditData.productAgeType!=undefined && incidentEditData.productAgeType!=null)?incidentEditData.productAgeType:'',
      noFootageAvailable:incidentEditData.noFootageAvailable,
      };
      return incidentFormData;
}
}
