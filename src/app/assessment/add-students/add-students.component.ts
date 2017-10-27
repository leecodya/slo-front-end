import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { ValidationManager } from 'ng2-validation-manager';
import { Course, Student } from '../../_models/';
import { StudentService, AlertService } from '../../_services/';


@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.sass']
})

export class AddStudentsComponent implements OnInit {
    form;
    formLoading: Boolean = false;

    @Input()
    course: Course;

    @Output('update')
    change: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output('advance')
    advanceSection: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private studentService: StudentService,
        private alertService: AlertService
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
        // Remove the student element from the page first, before sending the request out (Seems "quicker" to the user)
        let studentElement = document.getElementById(student.student_id.toString());
        document.getElementById("students-container").removeChild(studentElement);

        this.studentService.removeStudent(student, course).subscribe(
            data => {
                this.change.emit(true);
                console.log("Removed Student");
            },
            error => {
                console.log(error);
            }
        );
    }


    submit() {
        this.formLoading = true;
        let student = new Student(this.form.getData());
        this.form.reset();
        document.getElementById("student_id_input").focus();
        
        this.studentService.addStudent(student, this.course).subscribe(
            data => { 
                this.change.emit(true);
                
                setTimeout(() => {
                    this.formLoading = false;
                }, 300);
            },
            error => { console.log(error) }
        );
    }


    nextSection() {
        if (this.course.students.length == 0) {
            this.alertService.error("Please add your students first.");
        } else {
            this.advanceSection.emit(true);
        }
    }
}