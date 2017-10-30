import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HelperService } from './helper.service';
import 'rxjs/add/operator/map'

import { Faculty, Course } from '../_models';
import { environment } from '../../environments/environment';

@Injectable()
export class FacultyService {
    _baseURL: string = environment.api;
    constructor(private http: Http, private helperService: HelperService) { }

    getUserInfo() {
        return this.http.get(this._baseURL + '/users', this.helperService.jwt()).map((res: Response) => {
            return new Faculty(res.json());
        });
    }
    
    register(faculty: Faculty, password: String) {
        let facultyData = {
            email: faculty.email,
            faculty_id: faculty.faculty_id,
            first_name: faculty.first_name,
            last_name: faculty.last_name,
            password: password
        };

        return this.http.post(this._baseURL + '/register', facultyData).map((res: Response) => {
            return new Faculty(res.json());
        });
    }

    getProgress() {
        return this.http.get(this._baseURL + '/progress', this.helperService.jwt()).map((res: Response) => {
            let courses: Course[] = [];
            let courseData = res.json();

            for (let course of courseData) {
                courses.push(new Course(course));
            }

            return courses;
        })
    }
}