import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditListService {
  subject$ = new ReplaySubject();



  constructor() { 
  
  
  }
  
}
