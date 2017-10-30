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

    getCourse(crn: String) {
        return this.http.get(this._baseURL + `/course/${crn}`, this.helperService.jwt()).map((res: Response) => {
            return new Course(res.json());
        });
    }

    createCourse(course: Course) {
        let assigned_slos = [];
        course.assigned_slos.forEach(sloObject => {
            assigned_slos.push({
                slo_id: sloObject.slo_id,
                comments: null
            });
        });

        let courseData = {
            crn: course.crn,
            faculty_id: course.faculty.faculty_id,
            course_name: course.course_name,
            course_type: course.course_type,
            semester: course.semester,
            course_year: Math.floor(course.course_year.valueOf() / 1000),
            assigned_slos: assigned_slos
        }

        return this.http.post(this._baseURL + '/courses', courseData, this.helperService.jwt()).map((res: Response) => {
            return new Course(res.json());
        });
    }

    updateCourse(course: Course) {
        let assigned_slos = [];
        course.assigned_slos.forEach(sloObject => {
            assigned_slos.push({
                slo_id: sloObject.slo_id,
                comments: sloObject.comments
            });
        });

        let courseData = {
            faculty_id: course.faculty.faculty_id,
            course_name: course.course_name,
            course_type: course.course_type,
            semester: course.semester,
            course_year: Math.floor(course.course_year.valueOf() / 1000),
            assigned_slos: assigned_slos
        }

        console.log(courseData);

        return this.http.put(this._baseURL + `/course/${course.crn}`, courseData, this.helperService.jwt()).map((res: Response) => {
            return new Course(res.json());
        })
    }

    deleteCourse(course: Course) {
        return this.http.delete(this._baseURL + `/course/${course.crn}`, this.helperService.jwt()).map((res: Response) => {
            return res;
        });
    }
}