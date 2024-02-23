import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { Location } from '@angular/common';
import { RequestApiService } from "./request-api.service";
import { Utils } from "../../../shared/incident-shared/module/utils";
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ngxService } from "./ngxservice";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  public bsConfig ={dateInputFormat: 'DD-MM-YYYY',containerClass: 'theme-dark-blue',
      showWeekNumbers: false,isAnimated:true, adaptivePosition: true
    }
    public bsConfigf2f ={dateInputFormat: 'DD/MM/YYYY',containerClass: 'theme-dark-blue',
      showWeekNumbers: false,isAnimated:true, adaptivePosition: true
    }
    public bsConfig1 ={dateInputFormat: 'YYYY-MM-DD',containerClass: 'theme-dark-blue',
    showWeekNumbers: false,isAnimated:true, adaptivePosition: true
  }
  public bsConfig2 ={dateInputFormat: 'DD-MM-YYYY',containerClass: 'theme-dark-blue',
  showWeekNumbers: false,isAnimated:true, adaptivePosition: true
}
   public showMenu = false;
   public showLoader = false;
  public privilege: any = "";
  pdfLoader:boolean = false;
  public validImageFileExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
  constructor(private _snackBar: MatSnackBar, private router: Router,private location: Location,public ngxservice:ngxService) {}
  isPrivilegeExist(name: string) {
    this.privilege =
      localStorage.getItem("privilege") != "" &&
      localStorage.getItem("privilege") != null &&
      localStorage.getItem("privilege") != undefined
        ? localStorage.getItem("privilege")
        : "";
    let isExist = this.privilege.includes(name);
    return isExist;
  }
  openSnackBar(message: string, messageType: number, messageShotname: string) {
    let panelClass = messageType == 1 ? "green-snackbar" : "red-snackbar";
    this._snackBar.open(message, messageShotname, {
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: panelClass,
      duration: 3000,
    });
  }
  public allowNumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public allowNumberAndSpecialChars(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Allow numbers (0-9) and certain special characters based on their charCodes
    if (
      (charCode >= 48 && charCode <= 57) || // Numbers 0-9
      (charCode >= 32 && charCode <= 47) || // Space and special characters
      (charCode >= 58 && charCode <= 64) || // Special characters
      (charCode >= 91 && charCode <= 96) || // Special characters
      (charCode >= 123 && charCode <= 126)  // Special characters
    ) {
      return true;
    }
    
    return false;
  }

  public isValidEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      return true;
    } else {
      return false;
    }
  }
  public isValidURL(url: string) {
    let isUrlCorrect = false;
    try {
      const newUrl = new URL(url);
      isUrlCorrect =
        newUrl.protocol === "http:" || newUrl.protocol === "https:";
    } catch (err) {
      isUrlCorrect = false;
    }
    return isUrlCorrect;
  }
  public isValidImageFile(imageType:string,imageSize:number,imageName:string){
    let msg='';
    let isValid = true;
    let isValidImageType=this.validImageFileExtensions.includes(imageType);
    let isImageSizeExceed2MB = ((imageSize/(1024*1024))>2)?true:false;
    if (!isValidImageType) {
    msg='Sorry, ' + imageName + ' is invalid, allowed extensions are: ' + this.validImageFileExtensions.join(', ');
    isValid = false;
    }else if(isImageSizeExceed2MB===true){
     msg='Image exceed maximum size 2MB ';
     isValid = false;
    }
    let data = {isValid:isValid,msg:msg};
    return data;
  }
  onImgError(event:any){
 event.target.src = ''
//Do other stuff with the event.target
}
  public logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }
  public isEmpty(value:string){
     if(value==='' || value===null || value.trim().length===0){
      return true;
     }
     return false;
  }
  /* Validate time format 24hours HH:MM*/ 
   isValidTimeFormat(time:string){
     const validHHMMstring = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
     return validHHMMstring;
   }
   public refresh(): void {
  this.router.navigateByUrl('login', {skipLocationChange: true}).then((
  ) => {
  this.router.navigate([decodeURI(this.location.path())]);
  }
  );
  }
  textBoxAllowAplpabetsSpaceOnly(event:any) {
      var key = event.which || event.keyCode || 0;
      return ((key >= 65 && key <= 92) || 
              (key >= 97 && key <= 124) || key==32)
    }
    stringContainsSpecialChars(str:any) {
  const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;

  const result = specialChars.split('').some(specialChar => {
    if (str.includes(specialChar)) {
      return true;
    }

    return false;
  });

  return result;
}
 stringContainsNumbers(str:any) {
  const numbers = `1234567890`;

  const result = numbers.split('').some(numbers => {
    if (str.includes(numbers)) {
      return true;
    }

    return false;
  });

  return result;
}
compareDateTwoMonthCompleted(createdOn:any,numbetofDays:number){
    let currentDate =new Date();
  let newCreatedOn = new Date(createdOn);
  //  let d = newCreatedOn.getDate();
    newCreatedOn.setDate(newCreatedOn.getDate() + numbetofDays);
   
    // if (newCreatedOn.getDate() != d) {
    //   // newCreatedOn.setDate(0);
    // }
    if(newCreatedOn < currentDate){
      return true;
    }else{
      return false;
    }
}
RestrictSpaceSpecial(e:any) {  
  var k;  
  document.all ? k = e.keyCode : k = e.which;  
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));  
} 

 downloadAll(urls:any) {


  for (var i = 0; i < urls.length; i++) {
    this.forceDownload(urls[i], urls[i].substring(urls[i].lastIndexOf('/')+1,urls[i].length))
  }
}
 forceDownload(url:any, fileName:any){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

downloadAllwithloader(urls: string[], onAllDownloadsComplete: () => void): void {
  const totalDownloads = urls.length;
  let completedDownloads = 0;

  for (const url of urls) {
    this.forceDownloadwithloader(url, () => {
      completedDownloads++;

      if (completedDownloads === totalDownloads) {
        // All files have been downloaded
        onAllDownloadsComplete();
      }
    });
  }
}

 forceDownloadwithloader(url: string, onComplete: () => void): void {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement('a');
    tag.href = imageUrl;
    tag.download = url.substring(url.lastIndexOf('/') + 1);
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
    onComplete(); // Call the callback when the download is complete
  };
  xhr.send();
}

async downloadFilesAsZip(fileUrls: string[], zipFileName: string): Promise<void> {
  const zip = new JSZip();

  const filePromises = fileUrls.map(async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.substring(url.lastIndexOf('/') + 1); // Extract file name from the URL
    zip.file(fileName, blob);
  });

  await Promise.all(filePromises);

  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, zipFileName || 'downloaded_files.zip');
  });
}

public defaultInitialData(id:any,inciId:any,inciType:any){
  return {
    "isAdd":false,
    "idIncident":inciId,
    "id":id,
    "incidentSelectedTypeData":{
       "id":0,
       "name":inciType,
       "isShow":false
    },
    "incidentRowData":{
       "id":id,
       "incidentId":inciId,
       "reporterName":null,
       "store":"",
       "complainant":"",
       "injuredPersonFullName":"",
       "injuredPersonContactNumber":"",
       "injuredParentsContactNo":null,
       "injuredPersonEmail":"",
       "ageType":"",
       "ageValue":"",
       "calculatedAge":"",
       "injuredPersonAddress":"",
       "storeComments":"",
       "significantOthers":"",
       "eventActualDate":"",
       "eventReportedDate":"",
       "injurySustained":"",
       "injuryCircumstances":"",
       "evidenceTakenBy":"",
       "caseType":"Adult",
       "incidentStatus":"",
       "priorityCode":"",
       "otherComments":"",
       "csdNumber":"",
       "photoStatusCode":"",
       "cctvStatusCode":"",
       "initials":"",
       "incidentPrimaryCode":"",
       "incidentSecondaryCode":"",
       "severity":"",
       "preventability":"",
       "legalStatus":"",
       "claimDate":null,
       "claimReference":"",
       "incidentType":inciType,
       "incidentCountry":"",
       "incidentRegion":"",
       "articleId":"",
       "productDescription":"",
       "productAge":"",
       "childRecommendedAge":"",
       "batchNo":"",
       "productReturnToStore":null,
       "productReturnToHeadOffice":null,
       "problemReportedBefore":"",
       "proofOfPurchaseFilePath":"",
       "productCircumstances":"",
       "faultCode":"",
       "createdOn":"",
       "createdBy":"",
       "isActive":1,
       "createdByRole":"",
       "isViewed":false,
       "lockedUserName":null,
       "noFootageAvailable":"",
       "handlingTeams":[
          
       ],
       "witnessList":[
          
       ],
       "resolveActions":[
          
       ],
       "evidences":[
          
       ],
       "editVersion":null,
       "proofOfPurchaseFile":null,
       "deletionDate":"",
       "photoStatusInfo":null,
       "cctvStatusInfo":null,
       "incidentCodesInfo":null,
       "severityInfo":null,
       "preventabilityInfo":null,
       "faultCodesInfo":null,
       "incidentDetailsHistory":{
          "id":id,
          "revision":0,
          "revType":false,
          "incidentId":inciId,
          "reporterName":null,
          "store":"",
          "complainant":"",
          "injuredPersonFullName":"",
          "injuredPersonContactNumber":"",
          "injuredParentsContactNo":null,
          "injuredPersonEmail":"",
          "ageType":"Year",
          "ageValue":0,
          "calculatedAge":0,
          "injuredPersonAddress":"",
          "storeComments":"",
          "significantOthers":"",
          "eventActualDate":"",
          "eventReportedDate":"",
          "injurySustained":"",
          "injuryCircumstances":"",
          "evidenceTakenBy":"",
          "caseType":"Adult",
          "incidentStatus":"",
          "priorityCode":"",
          "otherComments":"",
          "csdNumber":"",
          "photoStatusCode":"",
          "cctvStatusCode":"",
          "initials":"",
          "incidentPrimaryCode":"",
          "incidentSecondaryCode":"",
          "severity":"",
          "preventability":"",
          "legalStatus":"",
          "claimDate":null,
          "claimReference":"",
          "incidentType":inciType,
          "incidentCountry":"",
          "incidentRegion":"",
          "articleId":"",
          "productDescription":"",
          "productAge":"",
          "childRecommendedAge":"",
          "batchNo":"",
          "returnToStoreDate":null,
          "returnToHeadOfficeDate":null,
          "problemReportedBefore":"",
          "proofOfPurchaseFilePath":"",
          "productCircumstances":"",
          "faultCode":"",
          "createdOn":"",
          "createdBy":"",
          "modifiedBy":"",
          "isActive":1,
          "createdByRole":"",
          "convertedCreatedDate":"",
          "createdById":"",
          "noFootageAvailable":"",
          "witnessList":[
             
          ],
          "evidencesList":[
             
          ],
          "handlingTeams":[
             
          ],
          "resolveActions":[
             
          ],
          "deletionDate":null,
          "photoStatusInfo":null,
          "cctvStatusInfo":null,
          "incidentCodesInfo":null,
          "severityInfo":null,
          "preventabilityInfo":null,
          "faultCodesInfo":null,
          "priorityInfo":null,
          "storeName":"Cardiff",
          "legalStatusInfo":null,
          "productAgeType":"",
          "evidenceSelected":"",
          "witnessSelected":"",
          "incidentCountryName":null,
          "incidentRegionName":null,
          "openWithBuyerVendor":"",
          "incidentInjury":"",
          "incidentCause":"",
          "priorityName":null,
          "genderType":"",
          "incidentInjuryDropDownInfo":null,
          "incidentCauseDropDownInfo":null,
          "witnessAvailable":false,
          "evidenceAvailable":false,
          "appropriateAge":true,
          "viewed":false,
          "approximateDate":false
       },
       "priorityInfo":null,
       "storeName":"",
       "convertedCreatedDate":"",
       "createdById":"",
       "incidentVersionLists":[
          
       ],
       "legalStatusInfo":null,
       "userName":null,
       "productAgeType":"",
       "evidenceSelected":"",
       "witnessSelected":"",
       "incidentCountryName":"",
       "incidentRegionName":"",
       "openWithBuyerVendor":"",
       "incidentInjury":"",
       "incidentCause":"",
       "incidentInjuryDropDownInfo":null,
       "historySaveFlag":null,
       "incidentCauseDropDownInfo":null,
       "priorityName":null,
       "genderType":"",
       "userRole":null,
       "userCountry":null,
       "incidentFlag":"",
       "requestBaseUrl":null,
       "witnessAvailable":false,
       "evidenceAvailable":false,
       "appropriateAge":true,
       "approximateDate":false
    }
 }
}
// forceDownload1(url:any, fileName:any){
// //   var xhr = new XMLHttpRequest();
// // xhr.open("GET", url, true);
// // xhr.responseType = "arraybuffer";

// var xhr2 = new XMLHttpRequest();
// xhr2.open("GET", url, true);
// xhr2.responseType = "arraybuffer";

// // Add more XHR requests for additional files as needed...

// var zip = new JSZip();

// // xhr.onload = function () {
// //   zip.file(fileName, this.response);
// //   // Trigger the next XHR request (if any)
// //   xhr2.send();
// // };

// xhr2.onload = function () {
//   zip.file(fileName, this.response);
//   // Add more similar blocks for additional files (if any)...

//   // Generate the ZIP file once all files are loaded
//   zip.generateAsync({ type: "blob" }).then(function (blob) {
//     var urlCreator = window.URL || window.webkitURL;
//     var zipUrl = urlCreator.createObjectURL(blob);
//     var tag = document.createElement("a");
//     tag.href = zipUrl;
//     tag.download = "downloaded_files.zip";
//     document.body.appendChild(tag);
//     tag.click();
//     document.body.removeChild(tag);
//   });
// };

// xhr2.send();
// }

}
