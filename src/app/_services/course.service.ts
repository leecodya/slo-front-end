import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Course, Faculty, SLO, Student } from '../_models/';
import { HelperService } from './helper.service';
import { environment } from '../../environments/environment';


@Injectable()
export class CourseService {
    _baseURL: string = environment.api;

    constructor(
        private http: Http,
        private helperService: HelperService
    ) { }

    getCourses() {
        return this.http.get(this._baseURL + '/courses', this.helperService.jwt()).map((res: Response) => {
            let courses: Course[] = [];
            let courseData = res.json();

            for (let course of courseData) {
                courses.push(new Course(course));
            }

            return courses;
        });
    }
}