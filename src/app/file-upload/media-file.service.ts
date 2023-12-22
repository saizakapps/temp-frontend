import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

  export class MediaFileService {
    fileSizeUnit: number = 1024;
    public isApiSetup = false;
  
    constructor(private http: HttpClient) {}
  
    getFileSize(fileSize: number): number {
      if (fileSize > 0) {
        if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
          fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
        } else if (
          fileSize <
          this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
        ) {
          fileSize = parseFloat(
            (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
          );
        }
      }
  
      return fileSize;
    }
  
    getFileSizeUnit(fileSize: number) {
      let fileSizeInWords = 'bytes';
  
      if (fileSize > 0) {
        if (fileSize < this.fileSizeUnit) {
          fileSizeInWords = 'bytes';
        } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
          fileSizeInWords = 'KB';
        } else if (
          fileSize <
          this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
        ) {
          fileSizeInWords = 'MB';
        }
      }
  
      return fileSizeInWords;
    }
  
    uploadMedia(formData: any) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
      return this.http
        .post(`http://yourapiurl`, formData, {
          headers,
          reportProgress: true,
          observe: 'events',
        })
        .pipe(
          map((event) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                const progress = Math.round((100 * event.loaded) / event.total!);
                return { status: 'progress', message: progress };
  
              case HttpEventType.Response:
                return event.body;
              default:
                return `Unhandled event: ${event.type}`;
            }
          })
        );
    }
  }
  