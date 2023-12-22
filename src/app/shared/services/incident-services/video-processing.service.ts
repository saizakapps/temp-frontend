import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class VideoProcessingService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  public promptForVideo(): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      // make file input element in memory
      const fileInput: any = this.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.setAttribute('capture', 'camera');
      // fileInput['capture'] = 'camera';
      fileInput.addEventListener('error', (event:any) => {
        reject(event.error);
      });
      fileInput.addEventListener('change', (event:any) => {
        resolve(fileInput.files[0]);
      });
      // prompt for video file
      fileInput.click();
    });
  }

  public generateThumbnail(videoFile: Blob): Promise<string> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    return new Promise<string>((resolve, reject) => {
      canvas.addEventListener('error',  reject);
      video.addEventListener('error',  reject);
      video.addEventListener('canplay', event => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        resolve(canvas.toDataURL());
      });
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = window.URL.createObjectURL(videoFile);
      video.load();
    });
  }

   public generateThumbnailFromURL(videoFile: any): Promise<any> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    return new Promise<any>((resolve, reject) => {
      canvas.addEventListener('error',  reject);
      video.addEventListener('error',  reject);
      video.addEventListener('canplay', event => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        //resolve(canvas.toDataURL());
         resolve(context);
      });
      // if (videoFile.type) {
      //   video.setAttribute('type', videoFile.type);
      // }
       video.setAttribute('type', 'mp4');
      video.preload = 'auto';
     // video.src = window.URL.createObjectURL(videoFile);
       video.src = videoFile;
      video.load();
    });
  }
  base64tomultipartevent(base64Data:any){
    base64Data = base64Data.replace('data:image/png;base64,','');
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'image/png' });
    return blob;
  }
}
