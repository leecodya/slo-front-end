import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { ValidationManager } from 'ng2-validation-manager';
import { Course, Student, Assessment } from '../../_models/';
import { StudentService, AlertService, AssessmentService } from '../../_services/';
import swal from 'sweetalert2';


@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.sass']
})

export class AddStudentsComponent implements OnInit {
    form;
    studentsBatchExcelFile = "";

    loadingAssessments: Boolean = true;
    assessments: Assessment[] = [];
    formLoading: Boolean = false;
    batchLoading: Boolean = false;

    @Input()
    course: Course;

    @Output('update')
    change: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output('advance')
    advanceSection: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private studentService: StudentService,
        private alertService: AlertService,
        private assessmentService: AssessmentService
    ) { }

    ngOnInit() {
        this.form = new ValidationManager({
            'student_id': 'required|minLength:9|maxLength:9|number',
            'first_name': 'required|maxLength:255',
            'last_name': 'required|maxLength:255'
        });

        this.updateAssessments();
    }

    ngOnChanges(changes: SimpleChange) {
        if (changes['course'] && ! changes['course'].isFirstChange()) {
            this.course = changes['course'].currentValue;
        }
    }

    studentAssessed(student): Boolean {
        let existingAssessment = this.assessments.filter(x => x.student.student_id == student.student_id);
        return existingAssessment.length > 0 ? true : false;
    }

    updateAssessments(retries = 0) {
        // if course exists, get assessment data for the course
        if (this.course.crn) {
            this.loadingAssessments = true;
            this.assessmentService.getAssessments(this.course).subscribe(
                data => {
                    this.assessments = data;
                    this.loadingAssessments = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loadingAssessments = false;
                    console.log(error);
                }
            );
        } else {
            // Perhaps component was just initialized. Unless this is our third time retrying, try again in 300 ms
            if (retries > 3) {
                this.loadingAssessments = false;
                return;
            } else {
                setTimeout(() => {
                    this.updateAssessments(retries + 1);
                }, 300)
            }
        }
    }

    changeListener(event) : void {
        this.readThis(event.target);
    }
      
    readThis(inputValue: any): void {
        var file:File = inputValue.files[0];
        if (file.size/1024 > 500) {
            this.alertService.error("File cannot be more than 500 kb in size");
            return;
        }
        var myReader:FileReader = new FileReader();
        
        myReader.onloadend = (e) => {
            this.studentsBatchExcelFile = myReader.result.split(',')[1];
        }
        myReader.readAsDataURL(file);
    }

    showHelp() {
        swal({
            title: 'Example Batch File',
            text: `Please ensure your excel file is in the format shown above. 
            The data must be on the first sheet, and the header row will be ignored. 
            Order is important. Extra columns, sheets, and data in the file will be ignored.`,
            imageUrl: './assets/example-batch-file.png',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Example batch file',
            customClass: 'sweet-alert-modal',
            background: '#292929'
        });
    }

    batchLoadStudents() {
        if (this.studentsBatchExcelFile.length == 0) {
            this.alertService.error("Please upload a valid file first.");
            return;
        }

        this.batchLoading = true;
        this.studentService.batchLoadStudents(this.studentsBatchExcelFile, this.course).subscribe(
            data => {
                this.change.emit(true);
                setTimeout(() => {
                    this.batchLoading = false;
                    this.alertService.success("Students successfully added.");
                }, 1000);
            },
            error => {
                this.batchLoading = false;
                this.alertService.error(error.json().message);
                console.log(error);
            }
        );
    }

    removeStudentConfirm(student: Student, course: Course) {
        let that = this;
        swal({
            title: `Delete ${student.first_name} ${student.last_name}?`,
            text: "This cannot be undone, and you will lose any assessments completed for this student.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete Student',
            confirmButtonColor: '#623890',
            cancelButtonText: 'Keep Student',
            cancelButtonColor: '#414141',
            customClass: 'sweet-alert-modal',
            background: '#292929'
          }).then(function (result) {
            if (result.value) {
                that.removeStudent(student, course);
                
                swal({
                    title: 'Deleted!',
                    text: "Your student has been removed.",
                    type: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#623890',
                    customClass: 'sweet-alert-modal',
                    background: '#292929'
                });
            }
          });
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