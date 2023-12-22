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
@Injectable({
  providedIn: "root",
})
export class CommonService {
  public bsConfig ={dateInputFormat: 'DD-MM-YYYY',containerClass: 'theme-dark-blue',
      showWeekNumbers: false,isAnimated:true, adaptivePosition: true
    }
   public showMenu = false;
   public showLoader = false;
  public privilege: any = "";
  pdfLoader:boolean = false;
  public validImageFileExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
  constructor(private _snackBar: MatSnackBar, private router: Router,private location: Location,) {}
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
compareDateTwoMonthCompleted(createdOn:any){
    let currentDate =new Date();
  let newCreatedOn = new Date(createdOn);
   var d = newCreatedOn.getDate();
    newCreatedOn.setMonth(newCreatedOn.getMonth() + +2);
    if (newCreatedOn.getDate() != d) {
      newCreatedOn.setDate(0);
    }
    if(newCreatedOn<currentDate){
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

}
