import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CourseGraphData, Course } from '../_models/';
import { HelperService } from './helper.service';
import { environment } from '../../environments/environment';


@Injectable()
export class GraphDataService {
    _baseURL: string = environment.api;

    constructor(
        private http: Http,
        private helperService: HelperService
    ) { }

    getCourseData(course: Course) {
        return this.http.get(this._baseURL + `/data/course/${course.crn}`, this.helperService.jwt()).map((res: Response) => {
            return new CourseGraphData(res.json());
        });
    }
}