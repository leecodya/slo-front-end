import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { ValidationManager } from 'ng2-validation-manager';
import { Course, Student } from '../../_models/';
import { StudentService } from '../../_services/';


@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.sass']
})

export class AddStudentsComponent implements OnInit {
    form;

    @Input()
    course: Course;

    @Output('update')
    change: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private studentService: StudentService
    ) { }

    ngOnInit() {
        this.form = new ValidationManager({
            'student_id': 'required|minLength:9|maxLength:9|number',
            'first_name': 'required',
            'last_name': 'required'
        });
    }

    ngOnChanges(changes: SimpleChange) {
        if (changes['course'] && ! changes['course'].isFirstChange()) {
            this.course = changes['course'].currentValue;
        }
    }

    removeStudent(student: Student, course: Course) {
        this.studentService.removeStudent(student, course).subscribe(
            data => {
                console.log(data);
                console.log("SUCCESS");
                this.change.emit(true);
            },
            error => {
                console.log(error);
            }
        );
    }


    submit() {
        console.log(this.course);
    }
}