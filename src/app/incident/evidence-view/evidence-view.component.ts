import { Component,OnInit,Input,Output, EventEmitter,ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonService } from '../../shared/services/incident-services/common.service';
import { VideoProcessingService } from '../../shared/services/incident-services/video-processing.service';
import { RequestApiService } from '../../shared/services/incident-services/request-api.service';
import { Utils } from '../../shared/incident-shared/module/utils';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
// import { LightGallery } from 'lightgallery/lightgallery';
// import lgZoom from 'lightgallery/plugins/zoom';
// import lgVideo from 'lightgallery/plugins/video';
import { Gallery, GalleryItem,GalleryAction, ImageItem, ThumbnailsPosition, ImageSize,VideoItem,YoutubeItem } from '@ngx-gallery/core';

@Component({
  selector: 'app-evidence-view',
  templateUrl: './evidence-view.component.html',
  styleUrls: ['./evidence-view.component.scss']
})
export class EvidenceViewComponent implements OnInit{
  @Input() files:any;
  @Input() isEvidence:any;
   items: any=[];
  proofItems:any=[];
  pdfURL:any;
  proofObjectData:any;
  constructor(private common:CommonService, private cdref:ChangeDetectorRef,public dialog: MatDialog,private thumnailVideo:VideoProcessingService,public gallery: Gallery,private utils:Utils){

  }
  showFlag:any = false;
  currentIndex:any = -1;
  ngOnInit():void{
    if(this.isEvidence){
      this.withCustomGalleryConfig();
      for (let x of this.files) {
        if(x.isEvidence && x.evidenceType=='Photo'){
          this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')), thumb: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')) }));
        }else if(x.isEvidence && x.evidenceType=='Video'){
           let thumnailImage = (x.thumbnailImageName)?this.utils.API.IMAGE_URL+x.thumbnailImageName:'assets/images/play-youtube-icon-7.jpg';
    
           this.items.push(new VideoItem({ src: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')), thumb: thumnailImage }));
        }
      }
      this.basicLightboxExample();
    }else{
      this.withCustomGalleryConfigProof();
      for (let x of this.files) {
        if(!x.isEvidence && x.evidenceType=='proofPhoto'){
          this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')), thumb: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')),type:'Photo'  }));
        }else if(!x.isEvidence && (x.evidenceType=='proofDocument' || x.evidenceType=='Document')){
           this.pdfURL= this.utils.API.IMAGE_URL+x.evidenceFilePath;
           this.proofItems.push(new ImageItem({ src: this.utils.API.IMAGE_URL+(x.evidenceFilePath.replaceAll('\\','/')), thumb: 'assets/healthsafetyimages/PDF_file_icon.png',type:'pdf' }));
        }
      }
      this.basicLightboxExampleProof();
    }
  }
  ngAfterViewInit(){
    this.cdref.detectChanges();
  }
   getFileNameBYPath(url:string){
    let filename = url.substring(url.lastIndexOf("\\")+1,url.length);
    return filename;
  }
    closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
   showLightbox(index:any) {
    this.currentIndex = index;
    this.showFlag = true;
  }

  basicLightboxExample() {
    this.gallery.ref().load(this.items);
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
//    this.gallery.( [
// { "previewFullscreen": true, "previewForceFullscreen": true },
// { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
// { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
// ])

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
//    this.gallery.( [
// { "previewFullscreen": true, "previewForceFullscreen": true },
// { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
// { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
// ])

    // 3. Load the items into the lightbox
    lightboxGalleryRef.load(this.proofItems);
  }
openPdfPopup(content:any){
  this.common.pdfLoader = true;
  this.dialog.open(content, {
      width: '600px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })

}
downloadProof(){
     let fileURLs=[];
    if(this.isEvidence==false){
      fileURLs = this.proofItems.map((item:any)=>item.data.src);
    }
     if(fileURLs.length>0){
      this.common.downloadAll(fileURLs);
    }
  }
  
  downloadEvidence(){
    let fileURLs=[];
    if(this.isEvidence==true){
fileURLs = this.items.map((item:any)=>item.data.src);
    }
    if(fileURLs.length>0){
      this.common.downloadAll(fileURLs);
    }
  }
 
  
}
