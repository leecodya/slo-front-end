import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Course, Faculty, SLO, Student } from '../_models/';
import { HelperService } from './helper.service';
import { environment } from '../../environments/environment';


@Injectable()
export class StudentService {
    _baseURL: string = environment.api;

    constructor(
        private http: Http,
        private helperService: HelperService
    ) { }

    removeStudent(student: Student, course: Course) {
        return this.http.delete(this._baseURL + `/student/${student.student_id}?crn=${course.crn}`, this.helperService.jwt())
            .map((res: Response) => { return res });
    }
}