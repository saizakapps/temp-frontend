import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
   
    if (localStorage.getItem('token')) {
      const privilege = localStorage.getItem("privilege");
      const url = route;
      return true;
    } else {
      // this.router.navigate(['/login']);
      return false;
    }
  
  }
  
}
