import { Component,Input,OnInit } from '@angular/core';
import { Gallery, GalleryItem,GalleryAction, ImageItem, ThumbnailsPosition, ImageSize,VideoItem,YoutubeItem } from '@ngx-gallery/core';
import {MatDialog, MatDialogRef, MatDialogModule,MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Utils } from '../../shared/incident-shared/module/utils';
import { ngxService } from '../../shared/services/incident-services/ngxservice';
import { CommonService } from '../../shared/services/incident-services/common.service';
@Component({
  selector: 'app-witness-statement-preview',
  templateUrl: './witness-statement-preview.component.html',
  styleUrls: ['./witness-statement-preview.component.scss']
})
export class WitnessStatementPreviewComponent implements OnInit {
@Input() witnessFiles:any;
@Input() isHistory:any;
items:any = [];
pdfURL:any='';
docURL:any='';
imageObjectWitnessStatement:any = [];
constructor(private common:CommonService, public ngxservice:ngxService, public gallery: Gallery,private dailog:MatDialog,private utils:Utils){}
ngOnInit():void{
	this.setWitnessFilesToPreview();
  //this.withCustomGalleryConfig();
}
withCustomGalleryConfig(){
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

   openPdfViewer(conntent:any,type:string,index:number){
  this.common.pdfLoader = true;
	this.pdfURL = '';
	this.docURL = '';
	
  if(type=='pdf'){
    this.pdfURL = this.utils.API.IMAGE_URL+this.witnessFiles[index].filePath;
    
  }else if(type=='word'){

     this.docURL = this.utils.API.IMAGE_URL+this.witnessFiles[index].filePath;
  }
    this.dailog.open(conntent, {
      width: '600px',
      // enterAnimationDuration:'100ms',
      // exitAnimationDuration:'1500ms'
    })
}
public imageSRC:any = [];
setWitnessFilesToPreview(){
	let witnessFiles = this.witnessFiles;
	for(let x=0; x<witnessFiles.length;x++){
		if(witnessFiles[x].witnessFileDeleted==0){
			   let data = {thumbImage:'',posterImage:'',src:'',type:''}
                if(witnessFiles[x].fileType=='jpg' || witnessFiles[x].fileType=='jpeg'){
                	 data = {thumbImage:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,posterImage:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,src:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,type:'Photo'}
                   this.items.push(new ImageItem({ src: this.utils.API.IMAGE_URL+witnessFiles[x].filePath, thumb: this.utils.API.IMAGE_URL+witnessFiles[x].filePath }));
                   this.imageSRC.push(data);
                }else if(witnessFiles[x].fileType=='pdf'){
                	 data = {thumbImage:'assets/healthsafetyimages/PDF_file_icon.png',posterImage:'assets/healthsafetyimages/PDF_file_icon.png',src:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,type:'pdf'}
                }else if(witnessFiles[x].fileType=='doc' || witnessFiles[x].fileType=='docx'){
                	 data = {thumbImage:'assets/healthsafetyimages/word_icon.png',posterImage:'assets/healthsafetyimages/word_icon.png',src:this.utils.API.IMAGE_URL+witnessFiles[x].filePath,type:'word'}
                }
               
              this.imageObjectWitnessStatement.push(data);
		}		
		}
		if(this.items.length>0){
			this.basicLightboxExample();
		}
		 
	
		}

	

    openImageViewer(imageView:any){
        this.dailog.open(imageView, {
        disableClose: true,
        width: '1000px',
        })
    }
    downloadWitnessFiles(){
       let filesUrL:any= this.imageObjectWitnessStatement.map((item:any)=>item.src);
  if(filesUrL.length>0){
    this.common.downloadAll(filesUrL);
  }
    }
openImageViewerNotHistory(){
  this.ngxservice.isShowImagePreview = true;
}

}
