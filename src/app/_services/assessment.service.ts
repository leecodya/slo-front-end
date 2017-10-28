import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Course, Faculty, SLO, Student, Assessment } from '../_models/';
import { HelperService } from './helper.service';
import { environment } from '../../environments/environment';


@Injectable()
export class AssessmentService {
    _baseURL: string = environment.api;

    constructor(
        private http: Http,
        private helperService: HelperService
    ) { }

    getAssessments(course: Course) {
        return this.http.get(this._baseURL + `/assessments/${course.crn}`, this.helperService.jwt()).map((res: Response) => {
            let assessments: Assessment[] = [];
            let assessmentData = res.json();

            for (let assessment of assessmentData) {
                assessments.push(new Assessment(assessment));
            }

            return assessments;
        });
    }
}