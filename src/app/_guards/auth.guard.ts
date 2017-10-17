import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    notTokenExpired() {
        let jwtHelper: JwtHelper = new JwtHelper();
        let token = JSON.parse(localStorage.getItem('currentUser')).access_token;
        if (token) {
            return jwtHelper.isTokenExpired(token);
        } else {
            return true;
        }
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser') && !(this.notTokenExpired())) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}