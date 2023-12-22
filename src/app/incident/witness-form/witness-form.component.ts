import { Component,OnInit,Input,Optional ,Output,HostListener, EventEmitter,Inject ,ChangeDetectorRef,ChangeDetectionStrategy} from '@angular/core';
import { CommonService } from '../../shared/services/incident-services/common.service';
import {MatDialog, MatDialogRef, MatDialogModule,MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormControl } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Utils } from '../../shared/incident-shared/module/utils';
import { Gallery, GalleryItem,GalleryAction, ImageItem, ThumbnailsPosition, ImageSize,VideoItem,YoutubeItem } from '@ngx-gallery/core';
import { Router } from '@angular/router';
import { ngxService } from 'src/app/shared/services/incident-services/ngxservice';

@Component({
  selector: 'app-witness-form',
  templateUrl: './witness-form.component.html',
  styleUrls: ['./witness-form.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush
  providers:[{ provide: MAT_DIALOG_DATA, useValue: {} },
   // { provide: MdDialogRef, useValue: {} }, --> deprecated
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class WitnessFormComponent implements OnInit{
	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
   //  let action = (this.witnessDailogData.isAddEdit==2)?false:true;
		 // let data = {isSave:action,witnessData:this.witnessForm.value};
		 //  //this.dailog.closeAll();
		//this.witnessSaveEvent.emit(data);
}
	@Input() witnessData:any;
	 @Output() witnessSaveEvent = new EventEmitter<any>();
	public oldData:any;
	public progressCount:any = 0;
	public fileErrorMessage:any = '';
	public imageObjectWitnessStatement:any = [];
	public pdfURL:any = '';
	public docURL:any = '';
  public deleteDailog:any;
allowedFileType = ["image/jpg","image/jpeg",'application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
fileTypeMessage = 'jpg,jpeg,pdf,doc,docx';
items: any=[];
galleryOptions:any=[{  previewFullscreen:true,}];
public isFileChanges=false;
	constructor(public gallery: Gallery,private fb: FormBuilder,
		private dailog:MatDialog,
		private cdRef:ChangeDetectorRef, public ngxservice:ngxService,
		public common:CommonService,public dialogRef: MatDialogRef<WitnessFormComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public witnessDailogData:any, private http:HttpClient,private utils:Utils, public router:Router){

	}
	witnessForm:any
	ngOnInit():void{
    
		if(this.witnessData.isAddEdit==2){
			//this.witnessData=this.witnessDailogData.data.data;
		}else{
			this.witnessData.id=0,
			this.witnessData.witnessName='';
			this.witnessData.witnessContactNumber='';
			this.witnessData.witnessAddress='';
			this.witnessData.witnessStatement='';
			this.witnessData.witnessContactEmail='';
			this.witnessData.witnessUnwillingToInvolve=false;
			this.witnessData.witnessDeleted=0
			this.witnessData.uniqueId = 0;
			this.witnessData.witnessFiles=[]
		}
		this.oldData = this.witnessData;

		this.witnessForm = this.fb.group({
		id:0,
		witnessName: ['', Validators.compose([Validators.required,this.witnessNameValidate])],
		witnessContactNumber: ['', Validators.compose([this.contactNumberValidate])],
		witnessContactEmail:['', Validators.compose([this.emailValidate])],
		witnessAddress: [''],
		witnessStatement: ['', Validators.compose([Validators.required])],
		witnessUnwillingToInvolve:[false],
		witnessDeleted:[0],
		uniqueId:[0],
		witnessFiles:[[]]
		});
      this.witnessForm.patchValue({
	id:this.witnessData.id,
	witnessName:this.witnessData.witnessName,
	witnessContactNumber:this.witnessData.witnessContactNumber,
	witnessContactEmail:this.witnessData.witnessContactEmail,
	witnessAddress:this.witnessData.witnessAddress,
	witnessStatement:this.witnessData.witnessStatement,
	witnessUnwillingToInvolve:this.witnessData.witnessUnwillingToInvolve,
	witnessDeleted:this.witnessData.witnessDeleted,
	uniqueId:this.witnessData.uniqueId,
	witnessFiles:this.witnessData.witnessFiles
});
      this.setWitnessFilesToPreview();
      this.withCustomGalleryConfig();
	}
	get formWitnessControls(): any {
   return this.witnessForm['controls'];
}

	ngOnChanges(changes: any) {

  for (let propName in changes) {
    let chng = changes[propName];
    let cur  = JSON.stringify(chng.currentValue);
    let prev = JSON.stringify(chng.previousValue);
  }
}
formSubmitAttempt:boolean = false;
isFieldValid(field: string) {
  return (!this.witnessForm.get(field).valid && this.witnessForm.get(field).touched) ||
    (this.witnessForm.get(field).untouched && this.formSubmitAttempt);
} 
	addWitness(){
		this.formSubmitAttempt = true;
		if(this.witnessDailogData.isAddEdit==2){
		this.setFormAutoTouched();
		}
		let mobileNo = this.witnessForm.value.witnessContactNumber;
		let id = this.witnessForm.value.id;
		let uniqueId = this.witnessForm.value.uniqueId;
		let mobileExistData=this.witnessData.alreadyAddedData.filter(function(item:any){
          return item.witnessContactNumber==mobileNo && item.uniqueId!=uniqueId && item.witnessDeleted==0;
		});

		let email = this.witnessForm.value.witnessContactEmail;
		let emailExistData=this.witnessData.alreadyAddedData.filter(function(item:any){
          return item.witnessContactEmail==email && item.uniqueId!=uniqueId  && item.witnessDeleted==0;
		});

       if(mobileExistData.length>0){
       	this.common.openSnackBar('Contact number already exist',2,'Required');
       	this.isFieldValid('witnessContactNumber');
       	this.witnessForm.get('witnessContactNumber').errors={message:'Contact number already exist'}
       }else if(emailExistData.length>0){
       		this.common.openSnackBar('Email already exist',2,'Required');
       		this.witnessForm.get('witnessContactEmail').errors={message:'Email already exist'}
       }else if(this.isValidWitnessForm(this.witnessForm.value)){

		let action = (this.witnessData.isAddEdit==2)?false:true;
		 let data = {isSave:action,witnessData:this.witnessForm.value};
	
		  this.dailog.closeAll();
		this.witnessSaveEvent.emit(data);
       }
	
		
	}
	CancelClick(){

      if(this.witnessData.isAddEdit==2){
      	this.witnessData=this.oldData;
      	let action = (this.witnessData.isAddEdit==2)?false:true;
      	 let data = {isSave:action,witnessData:this.witnessForm.value};
         this.witnessSaveEvent.emit(data);
      }
      this.dailog.closeAll();
	}

	witnessNameValidate(control:any){
		
	let isValid = true;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});

	const numbers = `1234567890`;
	let isNumberValid = true;
  let result2 = numbers.split('').some(number => {
    if (control.value.includes(number)) {
    	isNumberValid = false;
      return true;
    }
    return false;
    
  });
	if(control.value=='' || control.value.trim().length==0){
		isValid = false;
   return { 'message': 'Please enter witness name' };
	}else if(control.value.trim().length<3){
		isValid = false;

		//this.focusStyle = '{border: "1px solid red"  };';
		return { 'message': 'Witness name must be minimum 3 characters' };
	}else if(!isSpecialCharValid){
        return { 'message': 'Witness name must not allow special characters' };

	}else if(!isNumberValid){
        return { 'message': 'Witness name must not allow numbers' };

	}else {
		return null;
	}

	}
	contactNumberValidate(control:any){
	let isValid = true;
		let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});
	var Regex=/^[^a-zA-Z]*$/;
	if(control.value=='' || control.value.trim().length==0){
	isValid = false;
	return { 'message': 'Please enter contact number' };
	}else 

  if((control.value!=='' || control.value.trim().length!==0) && control.value.trim().length<8){
	isValid = false;
	return { 'message': 'Contact number must be minimum 8 characters' };
	}
	else if((control.value!=='' || control.value.trim().length!==0) && !Regex.test(control.value))
	{
	isValid = false;
	return { 'message': 'Contact number must not allow alphabets' };
	}else if(!isSpecialCharValid){
       return { 'message': 'Contact number must not allow special characters' };

	}else{
		return null;
	}
}
validateNameExist(e:any){
	let witnessName = this.witnessForm.value.witnessName;
	let isExist = this.witnessDailogData.data.alreadyAddedData.oldfilter(function(item:any){
		return item.witnessName==witnessName;
	})
	if(isExist){
		this.witnessForm['controls'].witnessName.errors={message:'Witness name already exist'};
	}
}

emailValidate(control:any){
	let isValid = true;
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if(control.value=='' || control.value.trim().length==0){
    // 	 isValid = true;
    // 	 return  { 'message': 'Please enter contact email' };
    // }else
     if ((control.value!=='' || control.value.trim().length!==0) && !re.test(control.value)) {
      isValid = true;
      return { 'message': 'Email is invalid' };
    } else {
      isValid = false;
      return  null;
    }
    
}
setFormAutoTouched(){
	 this.witnessForm.get('witnessName').touched=true;
      this.witnessForm.get('witnessContactNumber').touched=true;
      this.witnessForm.get('witnessContactEmail').touched=true;
      this.witnessForm.get('witnessAddress').touched=true;
      this.witnessForm.get('witnessStatement').touched=true;
}
public pdfDailog:any;
openPdfViewer(conntent:any,type:string,index:number){
  this.common.pdfLoader = true;
	this.pdfURL = '';
	this.docURL = '';
  if(type=='pdf'){
    this.pdfURL = this.utils.API.IMAGE_URL+this.witnessForm.value.witnessFiles[index].filePath;
    
  }else if(type=='word'){

     this.docURL = this.utils.API.IMAGE_URL+this.witnessForm.value.witnessFiles[index].filePath;
  }
    this.pdfDailog = this.dailog.open(conntent, {
      width: '600px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })
}
public currentIndex:number = 0;
deleteFilePopup(index:any,type:any,conformbox:any){
 this.currentIndex = index;
 this.deleteDailog= this.dailog.open(conformbox, {
      width: '400px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })
}
deleteFile(){
	this.imageObjectWitnessStatement.splice(this.currentIndex,1);
	let witnessFiles  = this.witnessForm.value.witnessFiles;
	witnessFiles[this.currentIndex].witnessFileDeleted=1;
	this.witnessForm.patchValue({witnessFiles:witnessFiles});
  this.deleteDailog.close();
}
async onFileDropped($event:any){
  this.isFileChanges = true;
	 for(let x=0;x<$event.length;x++){
          let isValid=this.ValidateEachFile($event[x]);
          if(isValid){
            this.fileErrorMessage='';
            //await this.base64ThumnailGenerate($event[x]);
            await this.uploadNewMultiple($event[x]);
          }else{
            break;
          }
             
          }
}
async fileBrowseHandler(event:any){
  this.isFileChanges = true;
	for(let x=0;x<event.files.length;x++){
            let isValid=this.ValidateEachFile(event.files[x]);
          if(isValid){
            this.fileErrorMessage='';
            await this.uploadNewMultiple(event.files[x]);
          }else{
            break;
          }
            
          }
}

getFileTypeName(fileName:string){
	let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
       
  	let fileTypeName = '';
      if(fileType=='pdf'){
      fileTypeName = 'pdf';
     }else if(fileType=='application/msword' || fileType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
      fileTypeName = 'word';
     }else{
     	fileTypeName = fileType;
     }
     return fileTypeName;
  }

  getFileType(fileName:any){
  	let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
       
  	let fileTypeName = '';
      if(fileType=='jpg' || fileType=='jpeg'){
        fileTypeName = fileType;
      }else if(fileType=='pdf'){
      fileTypeName = 'pdf';
     }else if(fileType=='application/msword'){
      fileTypeName = 'doc';
     }else if(fileType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
       fileTypeName = 'docx';
     }else{
     	fileTypeName = fileType;
     }
     return fileTypeName;
  }
async uploadNewMultiple(file:any){
    this.progressCount = 1;
    let username = localStorage.getItem('username');
   const uploadForm = new FormData();
  uploadForm.append('files', file);
  uploadForm.append('userName', username);
   const token = localStorage.getItem('authenticationToken');
    await new Promise((resolve, reject) => {
     this.http
      .post(this.utils.API.WITNESS_FILE_SAVE, uploadForm, {
        headers: {
      Authorization: `Bearer ${token}`
  },
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progressCount = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progressCount = 98;
          const myTimeout = setTimeout(()=>{
            this.progressCount = 0;
          }, 500);
            if(event.body.payLoad){
            this.progressCount = 100;
             const myTimeout = setTimeout(()=>{
            this.progressCount = 0;
          }, 500);
            
          let uploadedFile = event.body.payLoad;
      
            let witnessFiles = this.witnessForm.value.witnessFiles;
            let fileType = this.getFileTypeName(file.name);
           let finalFile = {filePath:uploadedFile,fileType:fileType,id:0,witnessId:this.witnessData.id,witnessFileDeleted:0}
              witnessFiles.push(finalFile);
              this.witnessForm.patchValue({witnessFiles:witnessFiles});
              let data = {thumbImage:'',posterImage:'',src:'',type:'',deleted:0}
                if(fileType=='jpg' || fileType=='jpeg'){
                	 data = {thumbImage:this.utils.API.IMAGE_URL+uploadedFile,posterImage:this.utils.API.IMAGE_URL+uploadedFile,src:this.utils.API.IMAGE_URL+uploadedFile,type:'Photo',deleted:0}
                this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL+uploadedFile, thumb: this.utils.API.IMAGE_URL+uploadedFile }));
                }else if(fileType=='pdf'){
                	 data = {thumbImage:'assets/healthsafetyimages/PDF_file_icon.png',posterImage:'assets/healthsafetyimages/PDF_file_icon.png',src:this.utils.API.IMAGE_URL+uploadedFile,type:'pdf',deleted:0}
                }else if(fileType=='doc' || fileType=='docx'){
                	 data = {thumbImage:'assets/healthsafetyimages/word_icon.png',posterImage:'assets/images/word_icon.png',src:this.utils.API.IMAGE_URL+uploadedFile,type:'word',deleted:0}
                }
              this.imageObjectWitnessStatement.push(data);
               this.basicLightboxExample();
            }
      
          }
         
        }),
        catchError((err: any) => {
          this.progressCount = 0;
         
          return throwError(err.message);
        })
      )
      .toPromise().then(res => {
         resolve(res);
      },msg=>{
 reject(msg);
      });
        });   
 }

ValidateEachFile(file:any){
    let isValid=true;
     let isValidFileType=this.validateAllowedFileType(file.type);
    let isValidFileSize=this.validateFileSize(file.size);
     if(!isValidFileType){
      this.fileErrorMessage = 'Invalid File type.Allowed only '+this.fileTypeMessage+' files';
      
      isValid = false;
    }else if(!isValidFileSize){
      this.fileErrorMessage = 'File size exceed maximum allowed file size 25MB ';
      
      isValid =false;
    }
    return isValid;
  }
   validateAllowedFileType(fileType:string){
     let isValid = this.allowedFileType.includes(fileType);
     return isValid;
  }
  /*
  File size maximum allowed 25MB
*/ 
validateFileSize(size:any){
  let sizeInMB = parseFloat((size / 1024 / 1024).toFixed(2)) ;
  let isValid = true;
  if(sizeInMB>25){
   isValid = false;
  }
  return isValid
}
setWitnessFilesToPreview(){
	let witnessFiles = this.witnessForm.value.witnessFiles;
	for(let x=0; x<witnessFiles.length;x++){
		//if(witnessFiles[x].witnessFileDeleted==0){
			   let data = {thumbImage:'',posterImage:'',src:'',type:'',deleted:witnessFiles[x].witnessFileDeleted}
                if(witnessFiles[x].fileType=='jpg' || witnessFiles[x].fileType=='jpeg'){
                	 data = {thumbImage:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,posterImage:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,src:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,type:'Photo',deleted:witnessFiles[x].witnessFileDeleted}
                  if(witnessFiles[x].witnessFileDeleted==0){
                  	  this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL+witnessFiles[x].filePath, thumb: this.utils.API.IMAGE_URL+witnessFiles[x].filePath }));
                  }
                  
                }else if(witnessFiles[x].fileType=='pdf'){
                	 data = {thumbImage:'assets/healthsafetyimages/PDF_file_icon.png',posterImage:'assets/healthsafetyimages/PDF_file_icon.png',src:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,type:'pdf',deleted:witnessFiles[x].witnessFileDeleted}
                }else if(witnessFiles[x].fileType=='doc' || witnessFiles[x].fileType=='docx'){
                	 data = {thumbImage:'assets/healthsafetyimages/word_icon.png',posterImage:'assets/images/word_icon.png',src:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,type:'word',deleted:witnessFiles[x].witnessFileDeleted}
                }
              this.imageObjectWitnessStatement.push(data);
		//}		
		}
		 this.basicLightboxExample();
	}

	 withCustomGalleryConfig() {

    // 2. Get a lightbox gallery ref
    const lightboxGalleryRef = this.gallery.ref('unitLightbox');

    // (Optional) Set custom gallery config to this lightbox
    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom,

    });
    // 3. Load the items into the lightbox
    lightboxGalleryRef.load(this.items);
  }

   basicLightboxExample() {
    this.gallery.ref().load(this.items);
  }
  isFieldValidStatement(field: string,fieldFile:any) {
  if(this.witnessForm.get(fieldFile).value.length>0 && this.isFileChanges){
    return false;
  }else{
  
    return  ((!this.witnessForm.get(field).valid  && this.witnessForm.get(field).touched && this.witnessForm.get(fieldFile).value.length==0)  ||
      (this.witnessForm.get(field).untouched && this.formSubmitAttempt));
  }
  
 
} 

isValidWitnessForm(witnessFormValue:any){
  let isValid=true;
   if(witnessFormValue.witnessName=='' || witnessFormValue.witnessName==null || witnessFormValue.witnessName.trim().length==0){
    isValid = false;
   }
   // else  if(witnessFormValue.witnessContactEmail=='' || witnessFormValue.witnessContactEmail==null || witnessFormValue.witnessContactEmail.trim().length==0){
   //  isValid = false;
   // }
   else  if((witnessFormValue.witnessContactEmail!=='' && witnessFormValue.witnessContactEmail!==null && witnessFormValue.witnessContactEmail.trim().length==0) && this.emailValidate(this.witnessForm.get('witnessContactEmail'))!=null){
    isValid = false;
   }
   else  if(witnessFormValue.witnessContactNumber=='' || witnessFormValue.witnessContactNumber==null || witnessFormValue.witnessContactNumber.trim().length==0){
    isValid = false;
   }
   else  if((witnessFormValue.witnessContactNumber!=='' || witnessFormValue.witnessContactNumber!==null) && witnessFormValue.witnessContactNumber.trim().length<8){
    isValid = false;
   }
   // else  if(witnessFormValue.witnessAddress=='' || witnessFormValue.witnessAddress==null || witnessFormValue.witnessAddress.trim().length==0){
   //  isValid = false;
   // }
   else  if((witnessFormValue.witnessStatement=='' || witnessFormValue.witnessStatement==null || witnessFormValue.witnessStatement.trim().length==0) && witnessFormValue.witnessFiles.length==0){
    isValid = false;
   }
   return isValid;
}
downloadWitnessFiles(){
  let filesUrL:any= this.imageObjectWitnessStatement.filter(function(item:any){
    return item.deleted==0
  }).map((item:any)=>item.src);
  if(filesUrL.length>0){
    this.common.downloadAll(filesUrL);
  }

}

isFieldValidEmail(field:any){
  let control =   this.witnessForm.get(field);
  let isValid:any =this.emailValidate(control);
   return ((isValid!=null || isValid==false ) && this.formSubmitAttempt);
}
isFieldValidContactNumber(field:any){
  let control =   this.witnessForm.get(field);
  let isValid:any =this.contactNumberValidate(control);
   return ((isValid!=null || isValid==false ) && this.formSubmitAttempt);
}
closeDailog(){
this.pdfDailog.close();
}
closeDelete(){
  this.deleteDailog.close();
}
}
