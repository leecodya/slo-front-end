import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { environment } from '../../environments/environment';
declare var google: any;

@Injectable()
export class HelperService {
    _baseURL: string = environment.api;
    geocoder = new google.maps.Geocoder();

    constructor(private http: Http) { }

    jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.access_token) {
            let headers = new Headers({ 'Authorization': 'JWT ' + currentUser.access_token });
            return new RequestOptions({ headers: headers });
        }
    }

    decode_jwt(token) {
        let jwt: JwtHelper = new JwtHelper();
        return jwt.decodeToken(token);
    }
}