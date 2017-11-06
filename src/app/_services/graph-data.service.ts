import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { SLOGraphData, CourseGraphData, Course, SLO } from '../_models/';
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

    getSLOData(slo: SLO, filter_by=null) {
        let paramString = '';
        if (filter_by) {
            paramString = `?filter_by=${filter_by}`
        }

        return this.http.get(this._baseURL + `/data/slo/${slo.slo_id}${paramString}`, this.helperService.jwt()).map((res: Response) => {
            return new SLOGraphData(res.json());
        });
    }
}