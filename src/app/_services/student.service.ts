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

    addStudent(student: Student, course: Course) {
        let studentData = {
            first_name: student.first_name,
            last_name: student.last_name,
            crn: course.crn
        };

        return this.http.post(this._baseURL + `/student/${student.student_id}`, studentData, this.helperService.jwt()).map((res: Response) => {
            return new Student(res.json());
        });
    }

    batchLoadStudents(excelBase64Encoded, course: Course) {
        let data = { file: excelBase64Encoded };

        return this.http.post(this._baseURL + `/students/batch/${course.crn}`, data, this.helperService.jwt()).map((res: Response) => {
            let students: Student[] = [];

            for (let student of res.json()) {
                students.push(new Student(student));
            }

            return students;
        })
    }
}