import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FacultyService, AlertService } from './../_services/';
import { Faculty } from './../_models/';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(
        private router: Router, 
        private facultyService: FacultyService,
        private alertService: AlertService
    ) { }

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
            return this.facultyService.getUserInfo().map(
                user => {
                    // "1" => Admin. "0" => Regular Faculty Member
                    if (user.user_type == "1") {
                        return true;
                    } else {
                        this.router.navigate(['/login']);
                        setTimeout(() => {
                            this.alertService.error("You are not an admin. Log in with an Admin account.");
                        }, 500);
                        return false;
                    }
                }
            );
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}