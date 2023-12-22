import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
//import  { environment } from '../../environments/environment';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RequestApiService {
  constructor(private http:HttpClient,private common:CommonService) { }
   public getHeader() {
     let token = localStorage.getItem("token");
     if(token!='' && token!=null){
        const httpOptions = {
        headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
        })
        };
         return httpOptions;
     }else{
       const httpOptions = {
        headers: new HttpHeaders({
        })
        };
         return httpOptions;
     }
   
    
  }
  getData(url:string){
  	return new Promise((resolve, reject) => {
    
      this.http.get(url).subscribe(
        (response: any) => {
          resolve(response);
          
        }, error => {

          if (typeof error !== 'string') {
            this.common.openSnackBar(error?.error?.errors?.message || 'Internal Server Error !',2,"Failed");
          }
          reject('error');
        });
    });
     
  }
  postData(url:string,param:any){
  	return new Promise((resolve, reject) => {
    
      this.http.post(url,param).subscribe(
        (response: any) => {
          resolve(response);
          
        }, error => {

          if (typeof error !== 'string') {
            this.common.openSnackBar(error?.error?.errors?.message || 'Internal Server Error !',2,"Failed");
          }
          reject('error');
        });
    });
     
  }

}
