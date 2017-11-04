import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { ValidationManager } from 'ng2-validation-manager';
import { Course, Student, Assessment } from '../../_models/';
import { StudentService, AlertService, AssessmentService } from '../../_services/';


@Component({
  selector: 'app-class-reports',
  templateUrl: './class-reports.component.html',
  styleUrls: ['./class-reports.component.sass']
})

export class ClassReportsComponent implements OnInit {

    constructor(
        private studentService: StudentService,
        private alertService: AlertService,
        private assessmentService: AssessmentService
    ) { }

    ngOnInit() {

    }
}