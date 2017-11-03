import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AlertService } from '../_services';
import { Course } from '../_models';
import { AddStudentsComponent } from './add-students/add-students.component';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass'],
})
export class AssessmentComponent implements OnInit {
  course: Course = new Course();
  loadingCourse: Boolean = true;
  currentSection = 'Add Students';
  deleteCourseConfirm: Boolean = false;

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
    if (!this.deleteCourseConfirm) {
      this.deleteCourseConfirm = true;
      return;
    }

    this.courseService.deleteCourse(this.course).subscribe(
      data => {
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
      }
    );
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
