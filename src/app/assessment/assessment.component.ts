import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AlertService } from '../_services';
import { Course } from '../_models';
import { AddStudentsComponent } from './add-students/add-students.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass'],
})
export class AssessmentComponent implements OnInit {
  course: Course = new Course();
  loadingCourse: Boolean = true;
  currentSection = 'Add Students';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      let crn = params['crn'];

      this.loadingCourse = true;
      this.courseService.getCourse(crn).subscribe(
        data => { 
          this.course = data;
          this.loadingCourse = false;
        },
        error => { 
          console.log(error);
          this.loadingCourse = false;
        }
      );
    });
  }

  loadSection(section) {
    this.currentSection = section;
  }

  deleteCourse() {
    let that = this;

    swal({
      title: `Delete this course?`,
      text: "This cannot be undone, and you will lose all students entered and assessments completed for this course.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete Course',
      confirmButtonColor: '#623890',
      cancelButtonText: 'Keep Course',
      cancelButtonColor: '#414141',
      customClass: 'sweet-alert-modal',
      background: '#292929'
    }).then(function (result) {
      if (result.value) {
        that.courseService.deleteCourse(that.course).subscribe(
          data => {
            that.alertService.success('Course successfully deleted.', true);
            that.router.navigate(['/home']);
          },
          error => {
            that.alertService.error(error.json().message);
            console.log(error);
          }
        );
      }
    });
  }

  updateCourse() {
    this.courseService.getCourse(this.course.crn).subscribe(
      data => {
        this.course = data;
      }, 
      error => {
        console.log(error);
      }
    );
  }

  nextSection() {
    if (this.currentSection == 'Add Students') {
      this.currentSection = 'Assess Students';
    } 
    else if (this.currentSection == 'Assess Students') {
      this.currentSection = 'Leave Comments';
    }
  }

}
