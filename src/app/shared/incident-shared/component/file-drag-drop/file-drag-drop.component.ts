import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '../../../services/incident-services/common.service';
import { VideoProcessingService } from '../../../services/incident-services/video-processing.service';
import { RequestApiService } from '../../../services/incident-services/request-api.service';
import { Utils } from '../../../incident-shared/module/utils';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Gallery, GalleryItem, GalleryAction, ImageItem, ThumbnailsPosition, ImageSize, VideoItem, YoutubeItem } from '@ngx-gallery/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { uniqueId } from 'underscore';
@Component({
  selector: 'app-file-drag-drop',
  templateUrl: './file-drag-drop.component.html',
  styleUrls: ['./file-drag-drop.component.scss']
})
export class FileDragDropComponent implements OnInit {
  files: any[] = [];
  @Input() data: any;
  @Output() fileDragEvent = new EventEmitter<any>();
  public fileErrorMessage = '';
  public lastSelectedFileName: string = '';
  public currentIndex: number = 0;
  public progressCount: number = 0;
  public currentImageId: number = 0;
  public isAlreadyFileUploadInProgress = false;
  public edidenceShowData: any[] = [];
  public proofShowData: any[] = [];
  public base64: string = '';
  public incidentData: any = { id: '', incidentId: '', requestfile: [], responsefile: [], inputData: {}, imageObjectProof: [], imageObject: [] };
  public posterImage: any;
  public thumbnailData: any;
  public allVideoThumnailData: any = [];
  public pdfURL: any;
  public wordURL: any;
  constructor(private cdref: ChangeDetectorRef, private thumnailVideo: VideoProcessingService, public gallery: Gallery, public dialog: MatDialog, private http: HttpClient, private utils: Utils, private common: CommonService, private requestapi: RequestApiService, public router: Router) {

  }
  loginEmployeeId: any;
  items: any = [];
  proofItems: any = [];
  galleryOptions: any = [{ previewFullscreen: true, }];
  public deleteType = '';
  public username: any = '';
  ngOnInit(): void {
    this.incidentData.inputData = this.data;
    this.incidentData.incidentId = this.data.incidentId;
    //    let employeeData:any = localStorage.getItem('users');
    // let employeeDataJson = JSON.parse(employeeData);
    // this.loginEmployeeId = employeeDataJson.employeeId;
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.username = localStorage.getItem('username');
    this.loginEmployeeId = this.username;
    if (this.data.isAdd == false) {
      this.incidentData.responsefile = (this.data.oldEvidenceData) ? this.data.oldEvidenceData : [];
      if (this.data.isEvidence == false) {
        let oldEvidenceData = (this.data.oldEvidenceData) ? this.data.oldEvidenceData.filter(function (item: any) {
          return item.isEvidence == false;
        }) : [];
        let imageShowObject = [];
        for (let x of oldEvidenceData) {
          if (x.evidenceDeleted == 0) {
            if (x.evidenceType == 'Photo' || x.evidenceType == 'proofPhoto') {
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')),uniqueId:x.uniqueId })
              this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')) }));
            } else if (x.evidenceType == 'Document' || x.evidenceType == 'proofDocument') {
              this.pdfURL = this.utils.API.IMAGE_URL + x.evidenceFilePath;
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: 'assets/healthsafetyimages/PDF_file_icon.png',uniqueId:x.uniqueId })
              this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: 'assets/healthsafetyimages/PDF_file_icon.png' }));
            }
          }

        }
        this.incidentData.imageObjectProof = imageShowObject;
        this.imageObjectProof = imageShowObject;
        this.proofShowData = oldEvidenceData;
      } else {
        this.incidentData.responsefile = this.data.responsefile;
        let oldEvidenceData = this.data.oldEvidenceData.filter(function (item: any) {
          return item.isEvidence == true;
        });
        let imageShowObject = [];
        for (let x of oldEvidenceData) {
          if (x.evidenceDeleted == 0) {
            imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')),uniqueId:x.uniqueId });
            if (x.evidenceType == 'Photo') {
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: 'assets/healthsafetyimages/play-youtube-icon-7.jpg',uniqueId:x.uniqueId })

              this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')) }));
            } else if (x.evidenceType == 'Video') {
              let fileType = x.evidenceFilePath.substr(x.evidenceFilePath.lastIndexOf('.') + 1);
              let thumnailImage:any
              if(fileType == 'avi'){
              thumnailImage = (x.thumbnailImageName !== '') ? this.utils.API.IMAGE_URL + x.thumbnailImageName : 'assets/healthsafetyimages/avi_icon.png';
              }
              else if(fileType == 'wmv' || fileType == 'x-ms-wmv'){
                thumnailImage = (x.thumbnailImageName !== '') ? this.utils.API.IMAGE_URL + x.thumbnailImageName : 'assets/healthsafetyimages/wmv_icon1.png';

              }
              else if(fileType !== 'wmv' && fileType !== 'x-ms-wmv' && fileType !== 'avi'){
                thumnailImage = (x.thumbnailImageName) ? this.utils.API.IMAGE_URL + x.thumbnailImageName : 'assets/healthsafetyimages/play-youtube-icon-7.jpg';
            }
            if(fileType !== 'x-ms-wmv' && fileType !== 'wmv' && fileType !== 'avi'){
                this.items.push(new VideoItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: thumnailImage }));
           
               }
            imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: thumnailImage,uniqueId:x.uniqueId })

            }
            else if(x.evidenceType=='WordDocument' || x.evidenceType == 'proofWordDocument'){
             // this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')), thumb: 'assets/healthsafetyimages/word_icon.png' }));
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\','/')), thumbImage: 'assets/healthsafetyimages/word_icon.png', type : x.evidenceType,uniqueId:x.uniqueId  });
    
            }
            //   else if(x.evidenceType=='Video'){
            //     let thumnailImage = (x.thumbnailImageName)?this.utils.API.IMAGE_URL+x.thumbnailImageName:'assets/healthsafetyimages/play-youtube-icon-7.jpg';

            //    this.items.push(new VideoItem({ src: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')), thumb: thumnailImage })); 
            //   imageShowObject.push({image:this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')),thumbImage:thumnailImage}) 

            //  }
          }

        }
        
        this.incidentData.imageObject = imageShowObject;
        this.imageObject = imageShowObject;
        this.edidenceShowData = oldEvidenceData;
      }
    }

    // With custom gallery config
    if (this.data.isEvidence == true) {
      this.withCustomGalleryConfig();
    } else {
      this.withCustomGalleryConfigProof();
    }
    this.setEvidenceFormat();
  }
  setEvidenceFormat(){
    let finalEvidence = [];
  this.data.responsefile.forEach((item:any,index:number)=>{
   item.uniqueId=index+1;
  })
  }
  validateAllowedFileType(fileType: string) {
    let isValid = this.data.allowedFileType.includes(fileType);
    return isValid;
  }
  ngAfterViewInit() {
    if (this.data.isAdd == false) {
      this.proofItems = [];
      this.items = [];

      this.incidentData.responsefile = (this.data.oldEvidenceData) ? this.data.oldEvidenceData : [];
      if (this.data.isEvidence == false) {
        let oldEvidenceData = (this.data.oldEvidenceData) ? this.data.oldEvidenceData.filter(function (item: any) {
          return item.isEvidence == false;
        }) : [];

        let imageShowObject = [];
        for (let x of oldEvidenceData) {
          if (x.evidenceDeleted == 0) {
            if (x.evidenceType == 'Photo' || x.evidenceType == 'proofPhoto') {
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), type: 'Photo',uniqueId:x.uniqueId })
              this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')) }));
            } else if (x.evidenceType == 'Document' || x.evidenceType == 'proofDocument') {
              this.pdfURL = this.utils.API.IMAGE_URL + x.evidenceFilePath;
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: 'assets/healthsafetyimages/PDF_file_icon.png', type: 'pdf',uniqueId:x.uniqueId })
              this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: 'assets/healthsafetyimages/PDF_file_icon.png' }));
            }
          }

        }
        this.incidentData.imageObjectProof = imageShowObject;
        this.imageObjectProof = imageShowObject;
        this.proofShowData = oldEvidenceData;

        this.basicLightboxExampleProof();
      } else {
        this.incidentData.responsefile = this.data.responsefile;
        let oldEvidenceData = this.data.oldEvidenceData.filter(function (item: any) {
          return item.isEvidence == true;
        });;
        let imageShowObject = [];
        for (let x of oldEvidenceData) {
          if (x.evidenceDeleted == 0) {
            if (x.evidenceType == 'Photo') {
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')),uniqueId:x.uniqueId })

              this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')) }));
            } else if (x.evidenceType == 'Video') {
              let fileType = x.evidenceFilePath.substr(x.evidenceFilePath.lastIndexOf('.') + 1);
              let thumnailImage:any
              if(fileType == 'avi'){
              thumnailImage = (x.thumbnailImageName !== '') ? this.utils.API.IMAGE_URL + x.thumbnailImageName : 'assets/healthsafetyimages/avi_icon.png';

              }
              else if(fileType == 'wmv' || fileType == 'x-ms-wmv'){
                thumnailImage = (x.thumbnailImageName !== '') ? this.utils.API.IMAGE_URL + x.thumbnailImageName : 'assets/healthsafetyimages/wmv_icon1.png';

              }
              else if(fileType !== 'wmv' && fileType !== 'x-ms-wmv' && fileType !== 'avi'){
                thumnailImage = (x.thumbnailImageName) ? this.utils.API.IMAGE_URL + x.thumbnailImageName : 'assets/healthsafetyimages/play-youtube-icon-7.jpg';
            }
            if(fileType !== 'x-ms-wmv' && fileType !== 'wmv' && fileType !== 'avi'){
                this.items.push(new VideoItem({ src: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumb: thumnailImage }));
           
               }
                imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\', '/')), thumbImage: thumnailImage,uniqueId:x.uniqueId })

            }
            else if(x.evidenceType=='WordDocument' || x.evidenceType == 'proofWordDocument'){
             // this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')), thumb: 'assets/healthsafetyimages/word_icon.png' }));
              imageShowObject.push({ image: this.utils.API.IMAGE_URL + (x.evidenceFilePath.replaceAll('\\','/')), thumbImage: 'assets/healthsafetyimages/word_icon.png', type : x.evidenceType,uniqueId:x.uniqueId  });
    
            }
          }


        }

        this.incidentData.imageObject = imageShowObject;
        this.imageObject = imageShowObject;
        this.edidenceShowData = oldEvidenceData;

        this.basicLightboxExample();

      }


      this.cdref.detectChanges();
    }
  }
  ValidateEachFile(file: any) {
    let isValid = true;
    let isValidFileType = this.validateAllowedFileType(file.type);
    let isValidFileSize = this.validateFileSize(file.size);
    if (!isValidFileType) {
      this.fileErrorMessage = 'Invalid File type.Allowed only ' + this.data.fileTypeMessage + ' files';
      this.isAlreadyFileUploadInProgress = false;
      isValid = false;
    } else if (!isValidFileSize) {
      this.fileErrorMessage = 'File size exceed maximum allowed file size 1GB ';
      this.isAlreadyFileUploadInProgress = false;
      isValid = false;
    }
    return isValid;
  }
  async base64ThumnailGenerate(file: any) {
    let imageType = file.type;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => {
      this.base64 = "data:" + imageType + ";base64," + btoa(event.target.result);
    };
    if (imageType.includes('video')) {
      await this.thumnailVideo.generateThumbnail(file).then(thumbnailData => {
        this.thumbnailData = thumbnailData;
        this.allVideoThumnailData.push(this.thumbnailData);
      }, error => {
        console.log(error, "error");
      });
    }
  }
  /**
   * on file drop handler
   */
  async onFileDropped($event: any) {

    this.isAlreadyFileUploadInProgress = true;
    this.prepareFilesList($event);
    for (let x = 0; x < $event.length; x++) {
      let isValid = this.ValidateEachFile($event[x]);
      if (isValid) {
        this.fileErrorMessage = '';
        await this.base64ThumnailGenerate($event[x]);
        await this.uploadNewMultiple($event[x]);
      } else {
        break;
      }

    }

  }

  public fileUploadCurrentIndex: number = 0;
  /**
   * handle file from browsing
   */
  async fileBrowseHandler(event: any) {
    this.progressCount = 0;
    this.prepareFilesList(event.files);
    for (let x = 0; x < event.files.length; x++) {
      let isValid = this.ValidateEachFile(event.files[x]);
      if (isValid) {
        this.fileErrorMessage = '';
        await this.base64ThumnailGenerate(event.files[x]);
        await this.uploadNewMultiple(event.files[x]);
      } else {
        break;
      }

    }

  }
  /*
    File size maximum allowed 1GB 
  */
  validateFileSize(size: any) {
    let sizeInGB = parseFloat((size / 1024 / 1024 / 1024).toFixed(2));
    let isValid = true;
    if (sizeInGB > 1) {
      isValid = false;
    }
    return isValid
  }
  /**
   * Delete file from files list
   * @param index (File index)
   */
  async deleteFile() {
    let requestData = { id: this.currentImageId, incidentId: (this.incidentData.incidentId!=null)?this.incidentData.incidentId.toString():'', modifiedBy: this.loginEmployeeId };
    // let response:any = await this.requestapi.postData(this.utils.API.EVIDENCE_DELETE,requestData);
    // if(response){
    //   if(response.payLoad){
      let deletedFileName='';
    this.files.splice(this.currentIndex, 1);
    if (this.deleteType == 'evidence') {
      let currentThumnail = this.imageObject[this.currentIndex].posterImage;
      let isVideoThumnail = this.allVideoThumnailData.includes(currentThumnail);
      if (isVideoThumnail) {
        let removethumindex = 0;
        for (let x of this.allVideoThumnailData) {
          if (currentThumnail == x) {
            break;
          }
          removethumindex = removethumindex + 1;
        }
        this.allVideoThumnailData.splice(removethumindex, 1);
      }      this.imageObject.splice(this.currentIndex, 1);
      this.incidentData.imageObject = this.imageObject;
    } else {
      this.imageObjectProof = [];
      this.incidentData.imageObjectProof = this.imageObjectProof;
    }
    for (let x of this.incidentData.responsefile) {
      if ((x.uniqueId)==this.newuniqueId) {
        x.evidenceDeleted = 1;
      }

    }
    this.fileDragEvent.emit(this.incidentData);
    //   }
    // }

  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    let id = 0;
    for (const item of files) {
      item.progress = 0;
      let type = this.getFileTypeName(item.type);
      this.lastSelectedFileName = item.name;
      let data = { id: id + 1, type: type, name: item.name, status: 'pending', isRetry: false, isDelete: false, progress: 0 };
      this.files.push(data);
      id++
    }
    this.currentIndex = this.files.length - 1;
    this.incidentData.requestfile = this.files;

    //this.uploadFilesSimulator(0);
  }



  getFileTypeName(fileType: string) {
    let fileTypeName = '';
    if (fileType.split('/')[0] == 'image') {
      fileTypeName = (this.data.isEvidence == true) ? 'Photo' : 'proofPhoto';
    } else if (fileType.split('/')[0] == 'video') {
      fileTypeName = (this.data.isEvidence == true) ? 'Video' : 'proofVideo';
    } else if (fileType.split('/')[1] == 'pdf') {
      fileTypeName = (this.data.isEvidence == true) ? 'Document' : 'proofDocument';
    } else if (fileType == 'doc' || fileType == 'docx' || fileType.split('/')[1] == 'msword' || fileType.split('/')[1] == 'vnd.openxmlformats-officedocument.wordprocessingml.document'){
      fileTypeName = (this.data.isEvidence == true) ? 'WordDocument' : 'proofWordDocument';
    } 
     else {
      fileTypeName = fileType;
    }
    return fileTypeName;
  }
  getFileTypeNameNew(type: any) {
    let fileTypeName = '';
    if (type == 'jpg' || type == 'jpeg') {
      fileTypeName = (this.data.isEvidence == true) ? 'Photo' : 'proofPhoto';
    } else if (type == 'mp4' || type == 'mov' || type == 'wmv' || type == 'webm' || type == 'avi' || type == 'x-ms-wmv') {
      fileTypeName = (this.data.isEvidence == true) ? 'Video' : 'proofVideo';
    } else if (type == 'pdf') {
      fileTypeName = (this.data.isEvidence == true) ? 'Document' : 'proofDocument';
    }
    else if (type == 'doc' || type == 'docx' || type.split('/')[1] == 'msword' || type.split('/')[1] == 'vnd.openxmlformats-officedocument.wordprocessingml.document'){
      fileTypeName = (this.data.isEvidence == true) ? 'WordDocument' : 'proofWordDocument';
    } 
    else {
      fileTypeName = type;
    }
    return fileTypeName;
  }
  editFile(index: number) {
    this.lastSelectedFileName = this.files[this.currentIndex].name;
  }
  lastSelectedFileNameChange(e: any) {
    let newFileName = e.srcElement.value;
    this.files[this.currentIndex].name = newFileName;
  }


  async uploadNewMultiple(file: any) {
    this.progressCount = 1;
    let id = (this.incidentData.incidentId > 0) ? this.incidentData.incidentId : ((this.data.incidentId > 0) ? this.data.incidentId : 0);
    const uploadForm = new FormData();
    let fileTypeName = this.getFileTypeName(file.type);
    const token = localStorage.getItem('authenticationToken');
    const username = localStorage.getItem('username');
    //  const headers= new HttpHeaders()
    // .set('Authorization:', 'Bearer ' + token)
    // .set('Access-Control-Allow-Origin', '*');
    uploadForm.append('files', file);
    uploadForm.append('evidenceType', fileTypeName);
    uploadForm.append('id', id);
    uploadForm.append('createdBy', this.loginEmployeeId);
    uploadForm.append('isEvidence', this.data.isEvidence);
    uploadForm.append('userName', username);
    
    if (fileTypeName == 'Video') {
      if (this.thumbnailData != undefined) {
        let blob = this.thumnailVideo.base64tomultipartevent(this.thumbnailData);
        uploadForm.append('evidenceThumbnailFile', blob, 'filename.png');
      }

    } else {
      uploadForm.append('evidenceThumbnailFile', '');
    }
    let evidenceId = 0;
    if ((this.incidentData.responsefile != null && this.incidentData.responsefile != undefined) && this.incidentData.responsefile.length > 0 && this.data.isEvidence == false) {
      let evidenceData = this.incidentData.responsefile.filter(function (item: any) {
        return item.isEvidence === false;
      });
      evidenceId = (evidenceData.length > 0) ? evidenceData[0].id : 0;
    } else {
      evidenceId = 0;
    }

    uploadForm.append('evidenceId', evidenceId.toString());

    let url = (this.data.isEvidence == true) ? this.utils.API.UPLOAD_INCIDENT_FILE_URL : this.utils.API.UPLOAD_PROOF_OF_DOCUMENT_URL;

    await new Promise((resolve, reject) => {


      this.http
        .post(this.utils.API.UPLOAD_INCIDENT_FILE_URL, uploadForm, {
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
              const myTimeout = setTimeout(() => {
                this.progressCount = 0;
              }, 500);
              if (event.body.payLoad) {
                this.progressCount = 100;
                const myTimeout = setTimeout(() => {
                  this.progressCount = 0;
                }, 500);
                let newResponseFile = (this.data.responsefile != null && this.data.responsefile != undefined) ? this.data.responsefile : [];
                for (let x of this.data.responsefile) {
                  let isExist = (this.data.responsefile != null && this.data.responsefile != undefined) ? this.data.responsefile.filter((item: any) => {
                    return item.uniqueId == x.uniqueId;
                  }) : [];
                  if (isExist.length == 0) {
                    newResponseFile.push(x);
                  } 
                  // else if (x.isEvidence == false) {
                  //   for (let y of newResponseFile) {
                  //     if (y.uniqueId == x.uniqueId) {
                  //       y.evidenceFilePath = x.evidenceFilePath;
                  //       y.evidenceType = x.evidenceType;

                  //     }
                  //   }
                  // }
                }
                let newUpdatedata = {id:0,uniqueId:(newResponseFile.length+1),incidentId:this.data.incidentId,isEvidence:this.data.isEvidence,evidenceFilePath:event.body.payLoad.fileName,thumbnailImageName:event.body.payLoad.thumbNailFileName,evidenceDeleted:0, evidenceType:fileTypeName}
             if(this.data.isEvidence==false){
              let isExistnew:any = newResponseFile.filter(function(item:any){
                return item.isEvidence == false;
              });
              if(isExistnew.length==0){
                newResponseFile.push(newUpdatedata);
              }
              else{
                
                let oldFinename=isExistnew[0].evidenceFilePath;
                newResponseFile.forEach((item:any)=>{
                  if(item.evidenceFilePath==oldFinename){
                    item.evidenceFilePath=event.body.payLoad.fileName;
                    item.evidenceType = fileTypeName;
                    item.evidenceDeleted = 0;
                  }
                })
              }
             }else{
              newResponseFile.push(newUpdatedata); 
             }
                // let responseFile = newResponseFile;
                this.incidentData = { incidentId: this.data.incidentId, requestfile: [], responsefile: newResponseFile, inputData: this.data };
                //this.prepareFilesList(file); 
                this.edidenceShowData = newResponseFile.filter(function (item: any) {
                  return item.isEvidence == true;
                });
                this.proofShowData = newResponseFile.filter(function (item: any) {
                  return item.isEvidence == false;
                });
                // let uploadedFile = event.body.payLoad;
                let uploadedFile = newResponseFile;
                this.data.responsefile=uploadedFile;
                 this.imageObject = [];
                 this.items = [];
                if (this.data.isEvidence == true) {
                  this.withCustomGalleryConfig();
                } else {
                  this.withCustomGalleryConfigProof();
                }
                let videoIndex = 0;
                for (var i = 0; i < uploadedFile.length; i++) {

                  if (uploadedFile[i].evidenceDeleted == 0) {
                    let fileType = uploadedFile[i].evidenceFilePath.substr(uploadedFile[i].evidenceFilePath.lastIndexOf('.') + 1);
                    let filetypeName = this.getFileTypeNameNew(fileType);
                    if (filetypeName == 'Photo') {
                      if (uploadedFile[i].isEvidence == true) {
                        this.imageObject.push({ image: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, thumbImage: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, title: uploadedFile[i].evidenceFilePath,uniqueId:uploadedFile[i].uniqueId });
                        this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, thumb: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath }));

                      }

                    }
                    else if (filetypeName == 'Video' || filetypeName == 'proofVideo') {
                      if (uploadedFile[i].isEvidence == true) {
                        let thumnailImage:any;
                        if(fileType == 'avi'){
                          thumnailImage = (this.allVideoThumnailData[videoIndex] != undefined) ? this.allVideoThumnailData[videoIndex] : 'assets/healthsafetyimages/avi_icon.png';
                          thumnailImage = (uploadedFile[i].thumbnailImageName != '') ? this.utils.API.IMAGE_URL + uploadedFile[i].thumbnailImageName : 'assets/healthsafetyimages/avi_icon.png';                     
                        }
                        else if(fileType == 'x-ms-wmv' || fileType == 'wmv'){
                          thumnailImage = (this.allVideoThumnailData[videoIndex] != undefined) ? this.allVideoThumnailData[videoIndex] : 'assets/healthsafetyimages/wmv_icon1.png';
                          thumnailImage = (uploadedFile[i].thumbnailImageName != '') ? this.utils.API.IMAGE_URL + uploadedFile[i].thumbnailImageName : 'assets/healthsafetyimages/wmv_icon1.png';
                        }
                        else if(fileType !== 'x-ms-wmv' && fileType !== 'wmv' && fileType !== 'avi'){
                          thumnailImage = (this.allVideoThumnailData[videoIndex] != undefined) ? this.allVideoThumnailData[videoIndex] : 'assets/healthsafetyimages/play-youtube-icon-7.jpg';
                          thumnailImage = (uploadedFile[i].thumbnailImageName) ? this.utils.API.IMAGE_URL + uploadedFile[i].thumbnailImageName : 'assets/healthsafetyimages/play-youtube-icon-7.jpg';  
                          this.items.push(new VideoItem({ src: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, thumb: thumnailImage }));

                        }
                        this.imageObject.push({ video: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, posterImage: thumnailImage, title: file.name,uniqueId:uploadedFile[i].uniqueId });
                        videoIndex = videoIndex + 1;
                      }
                    } 
                    else if (filetypeName == 'Document' || filetypeName == 'proofDocument') {
                      if (uploadedFile[i].isEvidence == false) {
                        this.imageObjectProof = [];
                        this.proofItems = [];
                        this.pdfURL = this.base64;
                        this.imageObjectProof.push({ image: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, thumbImage: 'assets/healthsafetyimages/PDF_file_icon.png', title: file.name, type: 'pdf',uniqueId:uploadedFile[i].uniqueId });
                        this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, thumb: 'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg' }));
                      }
                    } 
                    else if (filetypeName == 'proofPhoto') {
                      if (uploadedFile[i].isEvidence == false) {
                        this.imageObjectProof = [];
                        this.proofItems = [];
                        this.pdfURL = this.base64;
                        this.imageObjectProof.push({ image: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, thumbImage: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, title: file.name, type: 'Photo',uniqueId:uploadedFile[i].uniqueId });
                        this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath, thumb: this.utils.API.IMAGE_URL + uploadedFile[i].evidenceFilePath }))
                      }
                    } 
                    else if (filetypeName == 'WordDocument' || filetypeName == 'proofWordDocument') {
                      if (uploadedFile[i].isEvidence == true) {
                      this.imageObject.push({ image: this.utils.API.IMAGE_URL + (uploadedFile[i].evidenceFilePath.replaceAll('\\', '/')), thumbImage: 'assets/healthsafetyimages/word_icon.png', title: file.name, type: uploadedFile[i].evidenceType,uniqueId:uploadedFile[i].uniqueId });
                        // this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL + (uploadedFile[i].evidenceFilePath.replaceAll('\\', '/')), thumb: 'assets/healthsafetyimages/word_icon.png',  }));
                   
                      }  
                  }
                    
                  }
                }

                if (this.data.isEvidence == true) {
                  this.basicLightboxExample();
                } else {
                  this.basicLightboxExampleProof();
                }

                this.isAlreadyFileUploadInProgress = false;
                this.incidentData.imageObject = this.imageObject;
                this.incidentData.imageObjectProof = this.imageObjectProof;
                this.fileDragEvent.emit(this.incidentData);
                this.thumbnailData = undefined;
              }

            }
          
          }),
          catchError((err: any) => {
            this.progressCount = 0;
            this.isAlreadyFileUploadInProgress = false;

            return throwError(err.message);
          })
        )
        .toPromise().then(res => {
          resolve(res);
        }, msg => {
          reject(msg);
        });
    });
  }
  newuniqueId:any;
public currentRowImage ='';
  deleteFilePopup(index: any, type: string, content: any,img:any) {
    this.currentIndex = index;
    this.newuniqueId = img.uniqueId
    if (type == 'evidence') {
      this.currentImageId = this.edidenceShowData[index].uniqueId;
      this.deleteType = 'evidence';
    } else {
      this.currentImageId = this.proofShowData[0].uniqueId;
    }
     this.currentRowImage = img.image || img.video;
     this.currentRowImage = (this.currentRowImage!='' && this.currentRowImage!=null)?this.currentRowImage.substring(this.currentRowImage.lastIndexOf("\\") + 1, this.currentRowImage.length):''
    this.dialog.open(content, {
      width: '450px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })
  }
  getFileNameBYPath(url: string) {
    let filename = url.substring(url.lastIndexOf("\\") + 1, url.length);
    return filename;
  }

  showFlag: any = false;

  imageObject: Array<any> = [];
  imageObjectProof: Array<any> = [];
  showLightbox(index: any) {
    this.currentIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }

  basicLightboxExample() {
   - this.gallery.ref().load(this.items);
  }

  basicLightboxExampleProof() {
    this.gallery.ref().load(this.proofItems);
  }

  /**
   * Use custom gallery config with the lightbox
   */
  withCustomGalleryConfig() {

    // 2. Get a lightbox gallery ref
    const lightboxGalleryRef = this.gallery.ref('anotherLightbox');

    // (Optional) Set custom gallery config to this lightbox
    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom,

    });
    // 3. Load the items into the lightbox
    lightboxGalleryRef.load(this.items);
  }

  withCustomGalleryConfigProof() {

    // 2. Get a lightbox gallery ref
    const lightboxGalleryRef = this.gallery.ref('unitLightbox');

    // (Optional) Set custom gallery config to this lightbox
    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom,

    });

    // 3. Load the items into the lightbox
    lightboxGalleryRef.load(this.proofItems);
  }
  public pdfDailog: any;
  openPdfViewer(content: any) {
    this.common.pdfLoader = true;
    this.pdfDailog = this.dialog.open(content, {
      width: '600px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })
  }
  openWordViewer(content: any, filetype:any, img:any) {
    this.common.pdfLoader = true;
    this.wordURL = img.image
    this.pdfDailog = this.dialog.open(content, {
      width: '600px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })
  }
  downloadProof() {
    let fileURLs = [];
    this.common.openSnackBar('Preparing the files; downloading will begin shortly.',2,'Download');
    if (this.data.isEvidence == false) {
      fileURLs = this.proofItems.map((item: any) => item.data.src);
    }
    if (fileURLs.length > 0) {
      this.common.downloadAll(fileURLs);
    }
  }
  downloadLoader:boolean = false
  downloadEvidence() {
    let fileURLs = [];
    this.downloadLoader = true
    this.common.openSnackBar('Preparing the files; downloading will begin shortly.',2,'Download');
    if (this.data.isEvidence == true) {
       if(this.data.responsefile.length>0){
        fileURLs= this.data.responsefile.filter(function(item:any){
           return item.evidenceDeleted==0 && item.isEvidence==true;
         }).map((item:any)=>this.utils.API.IMAGE_URL + item.evidenceFilePath)
       }
      //fileURLs = this.items.map((item: any) => item.data.src);
     // fileURLs = this.imageObject.map((item: any) => item.image);
     
    }
    if (fileURLs.length > 0) {
      // this.common.downloadAll(fileURLs);
      this.common.downloadAllwithloader(fileURLs, () => {
        this.downloadLoader = false
      });
      // this.common.downloadFilesAsZip(fileURLs, 'my_archive.zip');
    }
  }
  closeDailog() {
    this.pdfDailog.close();
  }
}
