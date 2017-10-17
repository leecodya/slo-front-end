import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CourseService, AlertService } from '../_services';
import { Course } from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  courses: Course[] = [];
  specificCourse: Course = new Course();

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.courseService.getCourses().subscribe(
      data => {
        this.courses = data;
      },
      error => {
        this.alertService.error("Unidentified error occurred");
        console.log(error);
      }
    )
  }

  getSpecificCourse(event) {
    let crn = event.target.value;

    this.courseService.getCourse(crn).subscribe(
      data => { this.specificCourse = data },
      error => {
        this.alertService.error(error);
        console.log(error);
      }
    )
  }

}
