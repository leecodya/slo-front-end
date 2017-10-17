import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    _baseURL: string = environment.api;
    constructor(private http: Http) { }

    login(email: string, password: string) {
        let credentials = JSON.stringify({ email: email, password: password });
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseURL + '/auth', credentials, { headers: headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}