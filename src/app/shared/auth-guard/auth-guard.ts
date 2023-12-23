import { Utils } from './../utils';
/**
 * @author Winston.N
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private snackBar: MatSnackBar, private utils: Utils) { }

  canActivate(route: ActivatedRouteSnapshot) {
    // console.log(localStorage.getItem('isLoggedIn'));
    const accessApps: any = JSON.parse(localStorage.getItem('accessApps'));
    if (localStorage.getItem('isLoggedIn') === 'true' && accessApps && accessApps.length > 0) {
      let userDetails:any = JSON.parse(localStorage.getItem("userDetails") || '{}');
      const url = route.routeConfig.data['key'];
      if (userDetails.access[url] || url === 'view') {
        return true;
      } else {
        for (const key in userDetails.access) {
          if (userDetails.access[key]) {
            this.router.navigate([`/${key}`]);
            break;
          }
        }
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
