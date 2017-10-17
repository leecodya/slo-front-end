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

}
